# Dhebe Studios Project Guide

## Repository scope

This repository owns the Dhebe Studios website, browser tools, conversion
service, and optional DhebeVoice tester signup. Its GitHub repository is
`DattaDhebe/dhebe-studios`; the older Base64 repository is separate.

Trading implementation, storage, and the canonical shared VPS Caddyfile belong
to `F:\ai_projects\ai-trading`. Do not add `trade/` or `trading_bot/` here.
See `STORAGE.md` for ownership and private data locations.

## Runtime and commands

Use Node.js 24 and npm 11 or newer. Install with `npm ci`; do not remove the
lockfile as a troubleshooting shortcut.

```bash
npm run dev
npm run lint
npm test
npm run build
npm start
```

`npm run build` creates the static export in `out/`. `npm start` previews it on
loopback; it does not run `next start`. Read `AGENTS.md` and the relevant
installed Next.js guides before changing framework code.

## Implementation map

- `app/` owns routes and global styles.
- `components/` owns studios and tool interfaces.
- `lib/` owns registries, processing helpers, and the server conversion client.
- `services/tools/` owns isolated server conversions.
- `services/shared-hosting/` owns PHP tester signup and maintenance.
- `scripts/` owns preview, PDF.js synchronization, and deployment helpers.
- `tests/` owns unit, browser, and opt-in live checks.

## Verification and safety

Build before browser tests, then run `npx playwright install chromium` and
`npm run test:browser`. Normal CI uses generated fixtures and mocked service
requests; production signup tests require explicit disposable-fixture cleanup.

Keep server-processing disclosures, required tester consent, retention, and
error handling intact. Preserve version-matched PDF.js workers and assets.
Never commit documents, tester lists, credentials, database exports, or trading
data. Publish static files by overlay and preserve unrelated hosted applications.

The project has a custom personal-use/commercial license. Do not describe it as
MIT or alter `LICENSE` without the owner's explicit direction.
