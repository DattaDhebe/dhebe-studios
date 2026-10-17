from collections import deque
from contextlib import closing
from datetime import datetime, timedelta, timezone
import json
import os
from pathlib import Path
import re
import sqlite3
import threading
import time

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse

router = APIRouter()
CONSENT_VERSION = 'dhebevoice-testers-2026-10-17'
RETENTION_DAYS = 180
MAX_SIGNUPS = 10000
RATE_LIMIT = 30
REQUEST_TIMES = deque()
RATE_LOCK = threading.Lock()
LOCAL_PART = re.compile(r"[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*\Z")
DOMAIN_LABEL = re.compile(r'[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\Z')


def database_path():
    return Path(os.getenv('TESTER_DB_PATH', '/data/testers.sqlite3'))


def normalize_email(value):
    if not isinstance(value, str) or len(value) > 300:
        raise HTTPException(400, 'Enter a valid email address.')
    value = value.strip()
    if value.count('@') != 1:
        raise HTTPException(400, 'Enter a valid email address.')
    local, domain = value.rsplit('@', 1)
    try:
        domain = domain.encode('idna').decode('ascii').lower()
    except UnicodeError:
        raise HTTPException(400, 'Enter a valid email address.') from None
    labels = domain.split('.')
    if (not 1 <= len(local) <= 64 or not LOCAL_PART.fullmatch(local)
            or len(labels) < 2 or any(not DOMAIN_LABEL.fullmatch(label) for label in labels)
            or len(local + '@' + domain) > 254):
        raise HTTPException(400, 'Enter a valid email address.')
    return local.lower() + '@' + domain


def prune_expired(connection):
    cutoff = (datetime.now(timezone.utc) - timedelta(days=RETENTION_DAYS)).isoformat()
    connection.execute('DELETE FROM signups WHERE created_at < ?', (cutoff,))


def save_signup(email):
    path = database_path()
    path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    descriptor = os.open(path, os.O_CREAT | os.O_RDWR, 0o600)
    os.close(descriptor)
    with closing(sqlite3.connect(path, timeout=5)) as connection, connection:
        connection.execute('CREATE TABLE IF NOT EXISTS signups (email TEXT PRIMARY KEY, created_at TEXT NOT NULL, consent_version TEXT NOT NULL)')
        connection.execute('BEGIN IMMEDIATE')
        prune_expired(connection)
        count = connection.execute('SELECT count(*) FROM signups').fetchone()[0]
        if count >= MAX_SIGNUPS:
            raise HTTPException(503, 'The tester list is temporarily full. Please email support@dhebe.com.')
        connection.execute('INSERT OR IGNORE INTO signups VALUES (?, ?, ?)', (email, datetime.now(timezone.utc).isoformat(), CONSENT_VERSION))


def cleanup_loop():
    while True:
        time.sleep(3600)
        try:
            path = database_path()
            if path.is_file():
                with closing(sqlite3.connect(path, timeout=5)) as connection, connection:
                    prune_expired(connection)
        except (OSError, sqlite3.Error):
            # Retry next hour; never log subscriber addresses or database contents.
            pass


threading.Thread(target=cleanup_loop, daemon=True).start()


@router.post('/early-access/dhebevoice')
async def join_dhebevoice_testers(request: Request):
    allowed = {origin.strip() for origin in os.getenv('ALLOWED_ORIGINS', 'https://www.dhebe.com,https://dhebe.com').split(',')}
    if request.headers.get('origin') not in allowed:
        raise HTTPException(403, 'Submit this request from the DhebeVoice page.')
    if request.headers.get('content-type', '').split(';', 1)[0].strip().lower() != 'application/json':
        raise HTTPException(415, 'Use a JSON signup request.')
    with RATE_LOCK:
        now = time.monotonic()
        while REQUEST_TIMES and REQUEST_TIMES[0] < now - 60:
            REQUEST_TIMES.popleft()
        if len(REQUEST_TIMES) >= RATE_LIMIT:
            raise HTTPException(429, 'Too many signup requests. Please try again in a minute.', headers={'Retry-After': '60'})
        REQUEST_TIMES.append(now)
    body = bytearray()
    async for chunk in request.stream():
        if len(body) + len(chunk) > 1024:
            raise HTTPException(413, 'The signup request is too large.')
        body.extend(chunk)
    try:
        data = json.loads(body)
    except (ValueError, UnicodeError):
        raise HTTPException(400, 'The signup request could not be read.') from None
    if not isinstance(data, dict) or data.get('consent') is not True:
        raise HTTPException(400, 'Please agree to receive DhebeVoice testing invitations.')
    if data.get('website'):
        raise HTTPException(400, 'This signup request could not be accepted.')
    email = normalize_email(data.get('email'))
    try:
        save_signup(email)
    except (OSError, sqlite3.Error):
        raise HTTPException(503, 'Signup is temporarily unavailable. Please try again or email support@dhebe.com.') from None
    # Identical responses for new and existing addresses prevent list enumeration.
    return JSONResponse({'request_received': True}, headers={'Cache-Control': 'no-store'})
