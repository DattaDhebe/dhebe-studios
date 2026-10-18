# Contributing to Dhebe Studios

Thank you for helping improve the tools. Keep changes focused, preserve existing
work, and describe the user-facing problem before proposing an implementation.
Review [LICENSE](LICENSE) before using or contributing code; this is a custom
personal-use/commercial license, not MIT.

## Development setup

Use Node.js 24 and npm 11 or newer:

```bash
git clone https://github.com/DattaDhebe/dhebe-studios.git
cd dhebe-studios
npm ci
npm run dev
```

Read `AGENTS.md` and the relevant installed Next.js guide before framework
changes. Keep `package-lock.json` committed; do not remove it to bypass dependency
errors. Update dependencies intentionally, not as a side effect of unrelated work.

## Run checks

```bash
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

On Linux, `npx playwright install --with-deps chromium` also installs browser
system dependencies. PDF OCR tests may download recognition assets. Browser
regressions use generated fixtures and intercept server conversion/signup
requests; real service smoke tests are opt-in.

For the signup handler, run `php services/shared-hosting/tests.php` with PHP 8.3+
and PDO SQLite. The suite creates synthetic temporary data only. Windows skips
POSIX permission checks, so verify those on Linux before storage changes.
Conversion-service checks are described in [its guide](services/tools/README.md).

`npm start` previews `out/` on loopback after a build. It does not serve PHP or
replace the conversion API, and the production API does not allow local origins.
Use mocks or a separately configured local service when working on integrations.

## Pull requests

Start a focused branch from `main`. Include a short description, linked issue
when relevant, reproduction steps for bug fixes, and the checks you ran. Add a
regression test where practical. Include desktop/mobile screenshots for visual
changes, using synthetic content and no personal information.

Keep tool limits, required signup consent, server-upload disclosures, download
validation, and cleanup behavior intact. Test failure and cancellation paths,
not only successful conversions. Do not claim universal format support when a
tool handles only a subset.

## Ownership and sensitive data

Website changes belong in this repository. Trading code and commits belong only
in `F:\ai_projects\ai-trading`; never add `trade/` or `trading_bot/` here. Preserve
unrelated hosted applications during deployments. [STORAGE.md](STORAGE.md)
records the storage boundaries.

Do not attach or commit real documents, tester email addresses, databases,
backups, credentials, private exports, or live trading state. Use reserved
`example.com` addresses and generated fixtures. Report vulnerabilities privately
under [SECURITY.md](SECURITY.md), not in public issues.

## License and deployment

Do not change licensing, attribution requirements, production infrastructure,
or storage locations without explicit owner approval. CI validates changes;
it does not automatically publish the website. Follow the
[deployment guide](PDF_TOOLS_DEPLOYMENT.md) for an approved rollout.
