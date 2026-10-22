# DhebeVoice signup on Premium hosting

The website uses PHP 8.3 and private SQLite on Hostinger Premium, not a Next.js
API route or the conversion VPS. No Node.js server is needed on Premium.

## Deployment and Release Gate

| Repository file | Hostinger document-root path |
| --- | --- |
| signup.php | api/dhebevoice-signup.php |
| dhebevoice-smtp.php | api/dhebevoice-smtp.php |
| testers.php | api/dhebevoice-testers.php |
| maintenance.php | api/dhebevoice-maintenance.php |

Publish these handlers separately from the static out/ manifest. The SMTP helper
must sit beside the signup handler. Preserve all other api/, trade/, and ai_lead_agent/ applications.
Do not upload tests, templates, private settings, databases, or source archives.
Maintenance is CLI-only and refuses HTTP access.

Before activating verification, install settings.example.php ONLY as:

    /home/u942725982/domains/dhebe.com/private/dhebevoice-signups/settings.php

Use 0600 permissions and configure authenticated SMTP as described below. Do not
publish this settings file. Missing or invalid mail setup fails closed rather
than claiming verification. SMTP acceptance means queued, not inbox delivery.
Deployment and real delivery are separate from local mock tests.

## Authenticated SMTP Setup

Activated on October 22, 2026, after the owner entered the existing mailbox
password directly into the private settings file. The server-side check confirmed
valid PHP, 0700 directory and 0600 settings permissions, the expected sender and
username, the private dependency bundle, OpenSSL, and authenticated SMTP over
certificate-verified implicit TLS. No password was returned by the check or copied
into the local workspace.

One SMTP delivery test arrived in support@dhebe.com's INBOX at
2026-10-22 11:40:05 UTC (17:10:05 IST), not the Junk folder. Its received headers
reported SPF=pass, DKIM=pass for dhebe.com (hostingermail-a), and DMARC=pass, with
Return-Path support@dhebe.com. The new live signup handler matches the tested
source; no real tester record was created for this test. The short-lived,
token-protected status probe was removed and confirmed HTTP 404 afterward.
This self-test does not guarantee inbox placement at Gmail or other recipients;
retain the Spam/Junk notice and monitor delivery without weakening DNS or filters.

The source now replaces PHP mail() with PHPMailer, pinned by composer.lock. There
is no fallback to the generic hosting sender. Hostinger's authenticated SMTP
service supplies the transport and signing; the application does not implement
SMTP or DKIM itself.

1. Build the private dependency bundle using PHP 8.3 or newer:

   ```sh
   cd services/shared-hosting
   composer install --no-dev --prefer-dist --no-interaction --no-plugins --no-scripts
   composer audit --locked --no-dev
   php tests.php
   ```

2. Install the resulting vendor/ directory ONLY at
   /home/u942725982/domains/dhebe.com/private/dhebevoice-signups/vendor/.
   Keep this directory outside public_html, inside the existing 0700 private
   directory. Do not upload Composer files, tests, or private settings publicly.

3. In the existing private settings.php, retain mail_from and add the fields in
   settings.example.php: smtp_host=smtp.hostinger.com, smtp_port=465,
   smtp_encryption=ssl, smtp_username=support@dhebe.com, and smtp_password.
   The owner must enter the EXISTING mailbox password directly in that private
   file, or configure DHEBE_SIGNUP_SMTP_PASSWORD privately. Do not send it in
   chat or commit it. No mailbox password reset or new access grant is required.
   DHEBE_SIGNUP_MAIL_FROM and DHEBE_SIGNUP_SMTP_USERNAME are also supported as
   environment defaults when absent from the settings file. The username must
   match mail_from, and both must be a dhebe.com mailbox.

4. After private settings and dependencies are ready, upload dhebevoice-smtp.php
   beside api/dhebevoice-signup.php, then replace the signup handler LAST. Do not
   activate the new handler with only the legacy mail_from setting: it will
   correctly return 503. Until setup is ready, leave the existing live handler
   unchanged, and report that the transport fix is not yet active.

5. With the owner's approval, request one code to an owner-controlled inbox.
   Inspect the received message's full headers for aligned SPF/DKIM/DMARC and
   the domain envelope sender; check Inbox and Spam. Do not claim real delivery
   from mock tests or a successful SMTP queue response. Do not verify the code
   into the public tester list just to test mail. Retain the Spam/Junk warning:
   no transport can guarantee inbox placement.

Implicit TLS on port 465 is the default; mandatory STARTTLS on 587 is supported
only with smtp_encryption=tls. Certificate and hostname verification stay on;
there is no insecure, plaintext, alternate-host, or PHP mail fallback. SMTP
debugging is disabled, credentials never reach public responses, and failures
remove the pending challenge rather than reporting it as queued.

[Hostinger's SMTP settings](https://www.hostinger.com/support/1575756-how-to-get-email-account-configuration-details-for-hostinger-email/)
and [PHPMailer](https://github.com/PHPMailer/PHPMailer) are the authoritative
configuration and transport references.

## Spam Delivery Check (October 22, 2026)

Before the SMTP change, the deployment test to the owner's support mailbox was delivered but classified
as SPAM. Hostinger's delivery log showed the transport sender as
noreply@srv1004.main-hosting.eu, rather than the domain mailbox. Current DNS
already has Hostinger MX, SPF, three hosted DKIM selectors, and DMARC p=none;
those records alone do not authenticate messages sent by this PHP mail path.

Hostinger documents the generic sender and weaker deliverability of PHP mail(),
and recommends authenticated SMTP for regular website messages:
[Hostinger spam-delivery guidance](https://www.hostinger.com/support/3423286-what-to-do-if-sending-emails-go-to-spam/).
The current sender method is a likely contributor, not proof of the receiver's
complete spam-scoring decision. Do not weaken DMARC, disable spam filtering, or
promise inbox placement as a workaround.

The website now shows a prominent Spam/Junk notice before requesting a code and
through the code-entry/retry flow, including the exact subject to search for,
Not spam/Not junk guidance, resend advice, and the 10-minute expiry. This is a
delivery warning, not a guarantee of inbox placement. The authenticated transport
was subsequently activated and tested as recorded above. Future releases must
follow the same private configuration and delivery checks before being described
as active. Do not put passwords in chat, Git,
browser code, screenshots, or public files. Never reset the mailbox password or
create broader mailbox/API access just to avoid requesting that setup.

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
