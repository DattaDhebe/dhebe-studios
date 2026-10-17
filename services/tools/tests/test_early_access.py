from datetime import datetime, timedelta, timezone
import os
from pathlib import Path
import sqlite3
import tempfile
import unittest
from unittest.mock import patch

from fastapi import FastAPI
from fastapi.testclient import TestClient
import early_access

test_app = FastAPI()
test_app.include_router(early_access.router)
client = TestClient(test_app)
ENDPOINT = '/early-access/dhebevoice'
ORIGIN = 'https://www.dhebe.com'


class EarlyAccessTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.path = Path(self.directory.name) / 'private' / 'testers.sqlite3'
        self.environment = patch.dict(os.environ, {'TESTER_DB_PATH': str(self.path), 'ALLOWED_ORIGINS': ORIGIN})
        self.environment.start()
        early_access.REQUEST_TIMES.clear()

    def tearDown(self):
        self.environment.stop()
        self.directory.cleanup()

    def signup(self, email='reader@example.com', **extra):
        return client.post(ENDPOINT, json={'email': email, 'consent': True, 'website': '', **extra}, headers={'Origin': ORIGIN})

    def rows(self):
        with sqlite3.connect(self.path) as connection:
            return connection.execute('SELECT email, created_at, consent_version FROM signups').fetchall()

    def test_saves_email_and_explicit_consent_privately(self):
        response = self.signup(' Reader+Test@Example.com ')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'request_received': True})
        self.assertEqual(response.headers['cache-control'], 'no-store')
        self.assertEqual(self.rows()[0][0], 'reader+test@example.com')
        self.assertEqual(self.rows()[0][2], early_access.CONSENT_VERSION)
        if os.name != 'nt':
            self.assertEqual(self.path.stat().st_mode & 0o777, 0o600)

    def test_duplicate_signup_has_same_response_without_duplicate_or_timestamp_reset(self):
        first = self.signup()
        original = self.rows()
        second = self.signup('READER@example.com')
        self.assertEqual(first.json(), second.json())
        self.assertEqual(self.rows(), original)

    def test_invalid_addresses_are_not_saved(self):
        for email in [None, {}, 'missing-at', '.reader@example.com', 'r..x@example.com', 'reader@localhost', 'a@-example.com', 'a@exam_ple.com', 'x' * 65 + '@example.com', 'a\nb@example.com']:
            with self.subTest(email=email):
                self.assertEqual(self.signup(email).status_code, 400)
        self.assertFalse(self.path.exists())

    def test_consent_must_be_boolean_true(self):
        for consent in [False, None, 'true', 1]:
            self.assertEqual(self.signup(consent=consent).status_code, 400)
        self.assertFalse(self.path.exists())

    def test_foreign_or_missing_origin_is_rejected(self):
        for headers in [{}, {'Origin': 'https://untrusted.example'}]:
            self.assertEqual(client.post(ENDPOINT, json={'email': 'r@example.com', 'consent': True}, headers=headers).status_code, 403)
        self.assertFalse(self.path.exists())

    def test_non_json_malformed_or_oversized_requests_are_rejected(self):
        self.assertEqual(client.post(ENDPOINT, content='email=reader@example.com', headers={'Origin': ORIGIN}).status_code, 415)
        headers = {'Origin': ORIGIN, 'Content-Type': 'application/json'}
        self.assertEqual(client.post(ENDPOINT, content='{invalid', headers=headers).status_code, 400)
        self.assertEqual(client.post(ENDPOINT, content='[' + ' ' * 1100 + ']', headers=headers).status_code, 413)

    def test_honeypot_request_is_not_saved(self):
        self.assertEqual(self.signup(website='https://spam.example').status_code, 400)
        self.assertFalse(self.path.exists())

    def test_rate_limit_is_bounded(self):
        for _ in range(early_access.RATE_LIMIT):
            self.assertEqual(self.signup().status_code, 200)
        response = self.signup()
        self.assertEqual(response.status_code, 429)
        self.assertEqual(response.headers['retry-after'], '60')
        self.assertEqual(len(self.rows()), 1)

    def test_expired_emails_are_deleted(self):
        self.signup()
        old = (datetime.now(timezone.utc) - timedelta(days=181)).isoformat()
        with sqlite3.connect(self.path) as connection:
            connection.execute('UPDATE signups SET created_at = ?', (old,))
        self.signup('new-reader@example.com')
        self.assertEqual([row[0] for row in self.rows()], ['new-reader@example.com'])

    def test_capacity_does_not_disclose_existing_addresses(self):
        self.signup()
        with patch.object(early_access, 'MAX_SIGNUPS', 1):
            self.assertEqual(self.signup().status_code, 503)
            self.assertEqual(self.signup('another@example.com').status_code, 503)

    def test_database_failure_does_not_claim_success(self):
        with patch.object(early_access, 'save_signup', side_effect=sqlite3.OperationalError('private database detail')):
            response = self.signup()
        self.assertEqual(response.status_code, 503)
        self.assertNotIn('private database detail', response.text)

    def test_no_public_list_endpoint(self):
        self.signup()
        self.assertEqual(client.get(ENDPOINT).status_code, 405)
        self.assertNotIn('reader@example.com', client.get(ENDPOINT).text)

    def test_apostrophe_address_is_stored_as_data(self):
        self.assertEqual(self.signup("o'connor@example.com").status_code, 200)
        self.assertEqual(self.rows()[0][0], "o'connor@example.com")


if __name__ == '__main__':
    unittest.main()
