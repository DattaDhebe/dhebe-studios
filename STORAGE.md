# Website storage ownership

## Owning workspace

Website changes belong to `C:\Users\DELL\web_applications\Base64Convertor`.
Trading-specific implementation and commits belong only to
`F:\ai_projects\ai-trading`; its storage audit and rollout notes are in
`docs/WORKSPACE_STORAGE.md` in that repository.

The stray legacy `trade/` and `trading_bot/` directories were removed from this
workspace on 2026-10-17 by relocating them, including the local database, to the
trading workspace's ignored `deploy/artifacts/legacy-website-workspace-20261017/`.
All 31 files were preserved and verified by SHA-256. No active trading source
was overwritten and no database was committed. Root ignore rules prevent those
directories from appearing in future website commits.

## Current deployed storage

- The static website is hosted on Hostinger Premium at `https://www.dhebe.com`.
  The account reports a 100 GB file quota and approximately 0.1 GB used at audit.
- Most Base64, image, PDF, email, and calculator processing runs in the browser.
  Do not upload or retain these inputs to consume unused hosting capacity.
- Supported server conversions run at `https://tools.dhebe.com/api/tools` on
  VPS `200.234.47.229`. Source files are deleted after conversion; prepared
  results wait in memory for at most five minutes, then expire or are removed
  after download. Conversion documents must not be archived on Premium hosting.
- New DhebeVoice voluntary tester signups persist on Premium hosting, in
  `domains/dhebe.com/private/dhebevoice-signups/testers.sqlite3`, outside
  `public_html`. The frontend uses `/api/dhebevoice-signup.php`; cached clients
  using the old VPS URL are proxied to the same PHP endpoint. Only email, UTC
  creation time, and consent version persist, with 180-day expiry and daily
  pruning. See `services/shared-hosting/README.md`. Invitations remain manual.
- The legacy VPS volume `dhebe-tools_tester_signups` remains for rollback. One
  existing record awaits explicit owner-approved reconciliation; no old record
  has been deleted. Include that copy when administering the tester list until
  the migration is verified.
- The four shared-hosting MySQL databases belong to existing applications;
  their combined usage was approximately 31 MB, each with a reported 3 GB cap.
  Do not delete or repurpose them for this website without a migration plan.

## DhebeVoice tester data

New website tester signups are stored in a private SQLite database on Hostinger
Premium, not in MySQL, browser storage, or this Git repository:

```text
/home/u942725982/domains/dhebe.com/private/dhebevoice-signups/testers.sqlite3
```

This path is outside `public_html`; it is not a website URL. The directory has
0700 permissions and the database has 0600 permissions. Use authorized Hostinger
private-file or SSH administration to access it. There is no public tester-list,
admin, or export endpoint. Never upload the database to the public website or
commit it, an export, or real tester addresses to Git.

Each signup stores the normalized email address, original UTC signup timestamp,
and consent version. Entries expire after 180 days, with pruning on new signups
and through a daily maintenance job. Signup does not automatically send an
invitation. Handler, maintenance, and deployment details are in
[the signup service guide](services/shared-hosting/README.md).

One older tester record remains in the private legacy VPS volume
`dhebe-tools_tester_signups` at:

```text
/var/lib/docker/volumes/dhebe-tools_tester_signups/_data/testers.sqlite3
```

That copy is retained for rollback and awaits explicit owner approval before
migration. Include it when administering the tester list until reconciliation
is verified; do not delete or move it as part of routine website deployment.

## Shared-hosting rollout requirements

Tester signup's same-origin PHP endpoint is website work and is implemented,
tested, documented, and committed here. Keep persistent
data outside `public_html`, verify private file permissions and HTTP denial,
preserve consent/expiry/deduplication, and reconcile existing entries before
cutover. Do not silently split the authoritative list between two systems.
New signups use Premium; the single existing legacy record is a separate pending
consent migration. No bulk conversion-file retention was enabled.

Trading history/report storage must be implemented and documented in the
trading repository, not here. It must not introduce trading databases, broker
secrets, historical VPS backups, or release archives into the website export.

Deploy static exports by overlaying an explicit file manifest, assets first and
HTML last. Preserve existing `/trade/`, `/ai_lead_agent/`, and `/api/` applications;
never delete the document root or use a deployment that sweeps unrelated files.
Keep credentials, upload tokens, private database files, and exports out of Git.
