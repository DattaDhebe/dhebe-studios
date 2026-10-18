# Dhebe Studios Deployment Guide

The production frontend is a Next.js **static export** hosted on Hostinger
Premium at [www.dhebe.com](https://www.dhebe.com). It does not run a Next.js
Node.js server on shared hosting. The conversion API and tester-signup handler
are deployed separately.

## Build and verify

Use Node.js 24 and npm 11 or newer from the repository root:

```bash
npm ci
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

`prebuild` synchronizes PDF.js assets from the installed dependency. The build
creates `out/`, and `postbuild` adds static route-data aliases needed by the
shared host. For a local production preview, run `npm start` and open
`http://127.0.0.1:3000`. This loopback-only preview is not a production server.

## Publish the static frontend

Publish the **contents of `out/`**, not `.next/`, source code, `node_modules/`,
test fixtures, private databases, or credential files.

Use an explicit overlay manifest. Upload assets first, route data next, and HTML
last. Keep old versioned assets available for cached clients. Never clear or
replace the entire hosting document root: it also contains `/trade/`, `/api/`,
`/ai_lead_agent/`, and other applications managed separately.

[`scripts/overlay-static.mjs`](scripts/overlay-static.mjs) provides the validated
manifest and bounded upload helper. Its upload credentials must be obtained
through authorized hosting administration and kept only in memory. It does not
delete unrelated files or publish databases.

Include the versioned `pdfjs/` worker, fonts, CMaps, and WASM whenever the installed
PDF.js version changes. Do not publish only JavaScript bundles after a PDF.js
upgrade. Shared hosting may serve `.mjs` as plain text; the synchronized worker
uses `.js` to keep its MIME type executable.

## Separate services

| Service | Production endpoint | Owning code |
| --- | --- | --- |
| Static frontend | `https://www.dhebe.com` | This repository's `out/` |
| Conversion API | `https://tools.dhebe.com/api/tools` | [`services/tools/`](services/tools/README.md) |
| Tester signup | `POST /api/dhebevoice-signup.php` | [`services/shared-hosting/`](services/shared-hosting/README.md) |

Set `NEXT_PUBLIC_TOOL_API_URL` **before building** only when changing the API
base. Its default is the production conversion endpoint above. The server must
allow the intended frontend origins; local preview is not an approved
production origin.

The PHP handler is not part of the static export. Deploy its two production
files only as documented in its service guide. Never publish test scripts or
one-time helper templates. Tester data remains outside `public_html`.

The canonical shared VPS proxy configuration belongs to the separate
`F:\ai_projects\ai-trading` repository at `deploy/Caddyfile`. Do not overwrite it
with the historical `services/tools/Caddyfile.deployment` snapshot. Preserve the
signup compatibility route and existing trading routes; validate before reload.

## Post-deployment verification

Check the homepage, studio navigation, direct tool routes, and mobile layouts.
Confirm the consent checkbox appears before the signup button and the tester
privacy link opens the website-specific retention details.

For live conversion smoke tests, use generated non-personal documents. PowerShell:

```powershell
$env:TEST_BASE_URL = 'https://www.dhebe.com'
npx playwright test tests/browser/live-service.spec.ts --grep 'Live website|matching worker'
```

The real tester-signup test is opt-in. Do not set `TEST_TESTER_EMAIL` unless an
explicit disposable smoke fixture and private cleanup/verification are planned.
Normal signup regressions intercept requests and do not create tester records.

## Rollback

Retain a known-good export and its assets. If frontend validation fails, restore
only that manifest using the same overlay procedure. Leave private tester
databases, server volumes, and unrelated applications intact. A database or API
cutover requires its own reconciliation plan; restoring HTML is not a database
rollback.

## Repository and CI

The maintained repository is
[`DattaDhebe/dhebe-studios`](https://github.com/DattaDhebe/dhebe-studios), with
`main` as its default branch. The older Base64 repository is separate. GitHub CI
checks lint, tests, and the static build; it does not deploy or receive hosting
credentials. See [CONTRIBUTING.md](CONTRIBUTING.md) and [STORAGE.md](STORAGE.md).
