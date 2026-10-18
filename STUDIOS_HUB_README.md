# Dhebe Studios Architecture

Dhebe Studios is the multi-tool website at [www.dhebe.com](https://www.dhebe.com).
The homepage combines tool search, category filters, and studio shortcuts. Shared
workspaces keep upload/input controls near the top on mobile and provide
searchable navigation, keyboard access, and persistent light/dark themes.

## Studio routes

| Area | Entry point | Main implementation |
| --- | --- | --- |
| Homepage | `/` | `components/studios-hub.tsx` |
| PDF Studio | `/pdf-studio/` | `components/pdf-tools-workbench.tsx` |
| Image Studio | `/image-studio/` | `components/image-tools-workbench.tsx` |
| Base64 Studio | `/base64-studio/` | `components/base64-workbench.tsx` |
| Calculator Studio | `/calculator-studio/` | `components/calculator-tools-workbench.tsx` |
| Email Studio | `/email-studio/` | `components/email-studio-client.tsx` |
| DhebeVoice | `/dhebevoice/` | `app/dhebevoice/` and `components/dhebevoice-tester-form.tsx` |

Dedicated tool pages live under `/tools/[slug]/`, `/pdf-tools/[slug]/`,
`/image-tools/[slug]/`, and `/calculator-tools/[slug]/`. Existing direct routes,
such as `/compress-pdf/` and `/email-template-editor/`, remain available.

## Processing boundaries

Most tools process content in the browser. Email Studio is an implemented editor
with presets, blocks, undo/redo, local draft persistence, sandboxed preview, and
HTML export; it is not a waitlist or an email-sending platform.

Office conversions, native Office exports, PDF/A, encryption, repair, and
background removal use the isolated conversion API. The UI labels server
processing, accepts explicitly selected files, and exposes cancellation and
failure states. See the [service guide](services/tools/README.md) for limits and
temporary-file cleanup.

Optional tester signups use a same-origin PHP endpoint and private SQLite
storage on Premium hosting. They are separate from the Android app's reading
features and from document conversions. See [STORAGE.md](STORAGE.md).

## Build and ownership

Next.js generates a static website in `out/`. PDF.js assets are synchronized
before build and served through versioned URLs; post-build aliases support
shared-host route-data requests. [Deployment](PDF_TOOLS_DEPLOYMENT.md) describes
safe overlays and the separate service deployments.

Website code and commits belong here. Trading code, historical report storage,
and the canonical shared VPS proxy belong to `F:\ai_projects\ai-trading`.
Do not recreate `trade/` or `trading_bot/` in this repository.
