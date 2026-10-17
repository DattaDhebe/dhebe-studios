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
- DhebeVoice voluntary tester signups currently persist in the private VPS
  volume `dhebe-tools_tester_signups`, `/data/testers.sqlite3`. Only email, UTC
  creation time, and consent version are stored, with 180-day expiry. See
  `services/tools/README.md` for administration. Invitations remain manual.
- The four shared-hosting MySQL databases belong to existing applications;
  their combined usage was approximately 31 MB, each with a reported 3 GB cap.
  Do not delete or repurpose them for this website without a migration plan.

## Shared-hosting rollout requirements

Moving tester signup storage to a same-origin PHP endpoint is website work and
must be implemented, tested, documented, and committed here. Keep persistent
data outside `public_html`, verify private file permissions and HTTP denial,
preserve consent/expiry/deduplication, and reconcile existing entries before
cutover. Do not silently split the authoritative list between two systems.
This note records ownership and the audit, not a completed signup migration.

Trading history/report storage must be implemented and documented in the
trading repository, not here. It must not introduce trading databases, broker
secrets, historical VPS backups, or release archives into the website export.

Deploy static exports by overlaying an explicit file manifest, assets first and
HTML last. Preserve existing `/trade/`, `/ai_lead_agent/`, and `/api/` applications;
never delete the document root or use a deployment that sweeps unrelated files.
Keep credentials, upload tokens, private database files, and exports out of Git.
