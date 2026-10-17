# Website signup storage on Premium hosting

The public form calls `POST /api/dhebevoice-signup.php` on `www.dhebe.com`.
This request is handled by PHP 8.3 on the existing Premium account, not a Next.js
API route and not the conversion VPS. No Node.js server is needed on Premium.

## Deployment mapping

| Repository file | Hostinger document-root path |
| --- | --- |
| `signup.php` | `api/dhebevoice-signup.php` |
| `maintenance.php` | `api/dhebevoice-maintenance.php` |

Deploy those two files separately from the static `out/` manifest. Preserve all
other existing `api/`, `trade/`, and `ai_lead_agent/` files. Do not place tests,
unrendered templates, private databases, credentials, or source archives in the
document root. The maintenance file refuses HTTP access; it is CLI-only.

The private database is
`/home/u942725982/domains/dhebe.com/private/dhebevoice-signups/testers.sqlite3`,
outside `public_html`. Its directory is 0700 and the database is 0600. SQLite
uses transactions and a five-second busy timeout. There is no public list,
export, admin, or deletion-by-address endpoint.

Only normalized email, original UTC signup time, and explicit consent version
`dhebevoice-testers-2026-10-17` persist. Duplicate requests do not reset the signup
date. Requests must use an approved website Origin, JSON of at most 1 KB, boolean
consent, and an empty honeypot. A shared persistent counter permits 30 accepted
requests per calendar minute globally; no IP addresses are stored by this code.
The list is capped at 10,000 entries and expires after 180 days.

Pruning runs on signup and daily through Hostinger cron `0x0yuRFxrp`:

```text
17 2 * * *
/usr/bin/php /home/u942725982/domains/dhebe.com/public_html/api/dhebevoice-maintenance.php --prune
```

The cron and CLI maintenance command print counts only, never email addresses.
Use authorized Hostinger private-file/SSH administration to process verified
removal requests. Do not publish a database export or embed it in frontend code.
Testing invitations remain manual; no mail is sent by this endpoint.

## Cutover and verification

The shared Caddy configuration is owned and committed in the separate
`F:\ai_projects\ai-trading` repository, `deploy/Caddyfile`. The old
`tools.dhebe.com/api/tools/early-access/dhebevoice` URL forwards to the new PHP
endpoint so cached website clients do not create a second active list. The
private VPS volume is retained for rollback, not silently erased.

One existing consent record appeared in that legacy volume during deployment.
Its transfer requires the owner's explicit approval; until reconciled, the old
copy remains intact and must be included in tester-list administration.

`migrate.template.php` is a one-time, short-lived, token-authenticated migration
helper. Render its hash/expiry in memory, deploy only for the authorized transfer,
and reconcile directly over HTTPS without printing or saving raw records locally.
It preserves original timestamps and consent, then removes itself. Never expose
the template as a permanent route or use it as a public import API.

`verify-smoke.template.php` similarly accepts only generated
`dv-smoke-...@example.com` fixtures, checks the saved consent and permissions,
removes exactly that fixture, and deletes itself. It cannot export or remove
ordinary tester addresses. The temporary helpers deny requests without their
short-lived token. No setup token or rendered helper belongs in Git.

The production frontend keeps browser conversion files local and server
conversion uploads transient. Moving signup storage does not authorize keeping
uploaded documents on Premium hosting. App signup consent remains separate from
the Android application's offline reading features.

## Tests and rollback

`tests.php` exercises the handler against a synthetic temporary database. It is
not a public endpoint. Run in an isolated PHP 8.3 CLI environment with PDO SQLite.
Browser tests are `tests/browser/dhebevoice.spec.ts` in the website repository.

For rollback, first reconcile any newer shared-hosting consent records privately;
do not switch the frontend back to an empty or stale VPS database. Retain both
databases until reconciliation is verified. Only then restore the old signup URL
and the saved proxy config, validate Caddy, and reload without restarting workers.
