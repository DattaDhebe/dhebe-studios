"""Verify and remove only an explicitly named synthetic live-test record."""
from contextlib import closing
import os
from pathlib import Path
import re
import sqlite3
import sys

from early_access import CONSENT_VERSION

email = sys.argv[1] if len(sys.argv) == 2 else ''
if not re.fullmatch(r'dv-smoke-[a-z0-9-]+@example\.com', email):
    raise SystemExit('Refusing to inspect or remove a non-test address.')
path = Path(os.environ.get('TESTER_DB_PATH', '/data/testers.sqlite3'))
assert path.is_file(), 'The signup database has not been created.'
assert path.stat().st_mode & 0o077 == 0, 'Database permissions are too broad.'
assert path.parent.stat().st_mode & 0o077 == 0, 'Directory permissions are too broad.'
with closing(sqlite3.connect(path)) as connection, connection:
    row = connection.execute('SELECT email, created_at, consent_version FROM signups WHERE email = ?', (email,)).fetchone()
    assert row and row[0] == email and row[1] and row[2] == CONSENT_VERSION, 'Live signup was not saved with consent.'
    removed = connection.execute('DELETE FROM signups WHERE email = ? AND consent_version = ?', (email, CONSENT_VERSION))
    assert removed.rowcount == 1
print('Live signup persisted with consent and private permissions; synthetic record removed.')
