<p align="center">
  <img src="docs/assets/project-banner.svg" alt="Dhebe Studios — Document and developer utilities, together." width="100%">
</p>

This repository has grown from Base64 utilities into the **Dhebe Studios** tools hub. Its current routes cover PDF workflows, Base64 conversions, image tools, calculators, email design and DhebeVoice product pages.

[Website](https://www.dhebe.com) · [Feature guide](PDF_TOOLS_FEATURES.md) · [Deployment guide](PDF_TOOLS_DEPLOYMENT.md) · [Studios overview](STUDIOS_HUB_README.md)

## Repository Ownership

This repository owns the DHEBE website, browser tools, conversion service, and
DhebeVoice tester signup. Its storage/deployment boundaries are documented in
[STORAGE.md](STORAGE.md).

Trading code, trading data storage, VPS trading deployment scripts, tests, and
commits belong to the separate `F:\ai_projects\ai-trading` repository. Do not
create or commit `trade/` or `trading_bot/` here. Historical shared-host trading
paths must also be preserved when deploying this website; do not replace or wipe
the entire hosting document root.

## Explore the tool areas

| Area | Repository coverage |
| --- | --- |
| PDF Studio | Merge, split, compression and conversion routes |
| Base64 Studio | Encoding and decoding workbenches |
| Image Studio | Image utility routes and shared components |
| Calculator Studio | Date, age, BMI, EMI, loan, GST and other calculators |
| Email Studio | Email template editing |
| DhebeVoice | App information and privacy-policy pages |

Feature scope and limitations are documented in [PDF_TOOLS_FEATURES.md](PDF_TOOLS_FEATURES.md). A route or interface does not by itself guarantee complete support for every input format.

## Run locally

Install Node.js/npm compatible with the versions declared in [package.json](package.json).

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build for hosting

```bash
npm run build
```

The project uses static export configuration in [next.config.js](next.config.js). Publish the **contents** of the generated `out/` folder to a static host. The post-build script handles static route aliases.

See [PDF_TOOLS_DEPLOYMENT.md](PDF_TOOLS_DEPLOYMENT.md) for deployment-specific details. Do not upload source folders, `node_modules/` or `.next/` as the static site.

## Code map

| Location | Purpose |
| --- | --- |
| [app](app) | App Router pages and tool routes |
| [components](components) | Studios, workbenches and shared interface elements |
| [lib](lib) | Tool definitions and application utilities |
| [public](public) | Public assets |
| [scripts](scripts) | Static export post-processing |

## Related documentation

- [Implementation summary](IMPLEMENTATION_SUMMARY.md)
- [SEO and analytics notes](SEO_ANALYTICS_README.md)
- [PDF feature reference](PDF_TOOLS_FEATURES.md)
- [Studios hub reference](STUDIOS_HUB_README.md)

Built by [Datta Dhebe](https://github.com/DattaDhebe). Review [LICENSE](LICENSE) for repository terms.
