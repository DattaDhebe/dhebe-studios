# DhebeVoice signup on Premium hosting

The website uses PHP 8.3 and private SQLite on Hostinger Premium, not a Next.js
API route or the conversion VPS. No Node.js server is needed on Premium.

## Deployment and Release Gate

| Repository file | Hostinger document-root path |
| --- | --- |
| signup.php | api/dhebevoice-signup.php |
| testers.php | api/dhebevoice-testers.php |
| maintenance.php | api/dhebevoice-maintenance.php |

Publish these handlers separately from the static out/ manifest, before the new
frontend HTML. Preserve all other api/, trade/, and ai_lead_agent/ applications.
Do not upload tests, templates, private settings, databases, or source archives.
Maintenance is CLI-only and refuses HTTP access.

Before activating verification, install settings.example.php ONLY as:

    /home/u942725982/domains/dhebe.com/private/dhebevoice-signups/settings.php

Use 0600 permissions and a working domain sender in mail_from, or set the hosting
PHP environment variable DHEBE_SIGNUP_MAIL_FROM. Do not publish this settings file.
The implementation uses hosting PHP mail(), without third-party email-validation
services or new SMTP secrets. Confirm sender authentication and actual delivery
to an owner-approved disposable inbox before release. A successful mail() result
means queued, NOT delivered ([PHP mail documentation](https://www.php.net/manual/en/function.mail.php)). Missing mail setup fails closed rather than claiming
verification. Deployment and live delivery are separate from local mock tests.

## Private Storage and Retention

The authoritative database is:

    /home/u942725982/domains/dhebe.com/private/dhebevoice-signups/testers.sqlite3

This is outside public_html, not a website URL. The directory is 0700 and SQLite
file 0600. Transactions use a five-second busy timeout. Normalized email,
original UTC signup time, verification time, and consent version
dhebevoice-testers-2026-10-22 are stored. Public volunteers additionally store
their selected display name, full-email preference, random public ID, and opt-in
time. Codes and challenge IDs are stored only as hashes. Raw IPs are not stored.

The existing signups table and historical timestamps/consent are preserved.
Verification, pending, public-consent, and short-lived quota tables are additive.
Old signups are NOT automatically verified or made public. Confirmed signups
expire after 180 days; duplicates do not extend their original signup date.
Pending requests are unusable after 10 minutes and deleted on the next signup,
public-list read, or daily pruning run. Counters expire after their short windows.

Pruning runs through Hostinger cron 0x0yuRFxrp:

    17 2 * * *
    /usr/bin/php /home/u942725982/domains/dhebe.com/public_html/api/dhebevoice-maintenance.php --prune

Maintenance prints counts only. There is no public private-list export, owner
admin, or deletion-by-address endpoint. Use authorized private-file/SSH
administration for removal requests. Remove matching pending, public, and
verification rows as well as the signup so a still-valid pending code cannot
recreate a removed record. Never export real tester addresses into source control.

## Validation and Inbox Verification

POST /api/dhebevoice-signup.php requires an approved website Origin, JSON of at
most 1 KB, boolean consent, and an empty honeypot. Email validation checks syntax,
normalizes case/IDN domains, and checks MX, or A/AAAA when MX is absent. Null MX
is rejected. DNS alone does not prove the mailbox exists.

An eight-digit unpredictable code is tied to a random 256-bit request ID, expires
after 10 minutes, permits five failed attempts, and can be used once. Resending
invalidates the old challenge. The verify action accepts only request_id and
code; publication choices are taken from the original consent-bound request.
No code or request ID is placed in URLs, analytics, browser storage, or Git.
Requests for existing addresses use the same confirmation flow and do not reveal
whether the address is already a member.

Sends are bounded to one/address/minute, five/address/hour, and 100 globally/hour.
Signup and verification share 30 requests/minute. Pending plus confirmed records
share the 10,000 cap. Existing addresses can reverify at capacity without creating
duplicates. Legitimate plus/dot aliases are not collapsed into guessed identities.
Testing invitations remain manual; the automatic email only confirms inbox access.

## Optional Public List

GET /api/dhebevoice-testers.php?page=0 returns at most 24 separately opted-in,
verified volunteers per page. It excludes private, pending, and unverified
legacy records and returns no internal consent, code, or challenge material.
Public listing is unchecked by default and masks addresses as r***@e***.com.
Volunteers may add a display name and separately consent to showing their full
email. Full-email consent is also unchecked by default and is invalid without
public-list consent. Names are self-provided, limited to 60 characters, and
rendered as text; they are not identity-verified.

The public response contains a random ID, the chosen email label/visibility,
opted-in display name, and coarse opt-in date. Full addresses appear ONLY for
verified volunteers who explicitly selected full-email publication. The form
warns about search engines, spam, and copies that cannot be recalled.

Publication happens only after the emailed code is confirmed. Signing up and
verifying again changes publication choices. Verifying with the public checkbox
unchecked removes the public entry, not the private tester signup. Unverified
requests cannot publish, modify, or remove someone else's listing. Public
clients refresh every minute, manually, and after successful verification.
Email lookup and membership-by-address endpoints are not provided.

## Legacy Storage and Rollback

The shared Caddyfile belongs to F:\ai_projects\ai-trading, deploy/Caddyfile.
The old tools.dhebe.com/api/tools/early-access/dhebevoice URL forwards to the
same PHP endpoint so cached clients do not create a second list.

The private VPS volume dhebe-tools_tester_signups remains for rollback. One
historical record awaits explicit owner-approved reconciliation; it must remain
intact and be included in private tester administration until reconciled.
migrate.template.php is a short-lived token-authenticated migration helper,
not a permanent import endpoint. Transfer only with explicit approval and keep
original timestamps/consent. Never print or save raw records locally.

The legacy verify-smoke.template.php and old VPS verify_live_signup.py predate
inbox confirmation. Do not use them to bypass verification or send example.com
fixtures mail. Live delivery checks need an explicitly approved real disposable
inbox, no public opt-in, and targeted fixture cleanup.

Rollback must preserve the new verification/public-consent tables and private
signups. Do not reinstate a pre-verification handler that bypasses confirmation.
Suppress the public endpoint if an older frontend cannot manage publication
consent. Never replace this database with an empty or stale VPS copy.

Browser tool files remain local; server conversion documents remain transient.
Signup changes do not authorize document archiving or trading changes here.

## Tests

Run php services/shared-hosting/tests.php with PDO SQLite in an isolated PHP 8.3
CLI environment. The suite injects synthetic DNS/mail and creates/removes only
a temporary fixture database. Windows checks skip POSIX permissions, which still
require Linux verification. Browser regressions are in
tests/browser/dhebevoice.spec.ts with mocked signup and public-list responses.
Neither suite reads existing tester data or sends email. Verify real sender
delivery, private Linux permissions, and the deployed PHP/static pairing
separately before activation.
