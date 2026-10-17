<h1 align="center">PDF Tools Hub · Dhebe Studios</h1>
<p align="center"><strong>Everyday document and developer utilities in one web workspace.</strong><br>Next.js · React · TypeScript · Tailwind CSS</p>

This repository has grown from Base64 utilities into the **Dhebe Studios** tools hub. Its current routes cover PDF workflows, Base64 conversions, image tools, calculators, email design and DhebeVoice product pages.

[Website](https://www.dhebe.com) · [Feature guide](PDF_TOOLS_FEATURES.md) · [Deployment guide](PDF_TOOLS_DEPLOYMENT.md) · [Studios overview](STUDIOS_HUB_README.md)

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
