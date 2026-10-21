# Browser Utilities and Direct Tool Landings

## Routes

| Tool | Canonical path | Processing |
| --- | --- | --- |
| Photo and signature formatter | `/photo-signature-formatter/` | Exact dimensions, padding/crop positioning, quality search below a KB limit |
| Image to text | `/image-to-text/` | Browser OCR with English, Hindi, or Marathi model selection |
| HEIC to JPG/PNG | `/heic-to-jpg/` | Cancellable worker, sequential batch, individual and ZIP exports |
| JSON formatter/validator | `/json-formatter/` | Syntax validation and token-preserving formatting/minification |
| Invoice/quotation generator | `/invoice-generator/` | Cent-based totals, local PDF, browser print for other fonts |
| PDF to text | `/pdf-to-text/` | PDF.js extraction, optional English OCR on textless pages |
| Text/code diff | `/text-diff-checker/` | Bounded line-level LCS; no code evaluation |
| Favicon/app icons | `/favicon-generator/` | PNG-backed ICO, PNG icons, starter manifest and ZIP |

`/qr-code-generator/` additionally provides structured Wi-Fi, vCard, and UPI modes.
UPI details are encoded only: no validation of bank ownership, merchant approval,
payment initiation, settlement confirmation, or collection service is provided.
Wi-Fi codes contain the password; users must share them deliberately.

`/compress-pdf/` and `/pdf-tools/optimize-pdf/` include target-size controls.
Object repacking does not rasterize pages but does not promise support for every
advanced PDF feature. Any rewrite may invalidate digital signatures. Scan
flattening requires a separate acknowledgement, removes text/links/forms/tags,
and is limited to 50 pages. Requested sizes are never guaranteed. If unmet, the
best available file is clearly labelled and never downloaded as a successful fit.

## Limits and Privacy

No new VPS process, database, persistent upload store, or paid service is required.
The new tools process data locally, and drafts/results clear on reload. The
existing email editor's local storage and separately labelled server conversions
retain their documented behavior.

- General image/PDF inputs: 25 MB; decoded images: 40 megapixels.
- Photo formatter: 16-4096 pixels per dimension; 1-10,000 KB maximum; dimensions remain fixed.
- HEIC: up to 10 files, 15 MB each, 30 MB combined, 50 MB combined output; 90-second timeout per file.
- HEIC exports the first still image only; no promise of HDR, Live Photo, metadata, or extra-frame retention.
- PDF extraction/repacking: 150 pages; text extraction output: 2 million characters.
- JSON: 1 million input characters, 100 pretty-print levels, 5 million formatted characters.
- Diff: 100,000 characters and 3,000 lines per side, at most 2 million line pairs.
- Invoice: 30 items, two-decimal quantity/prices and percentage rates; tax is user-entered, after discount.

OCR engines/models load on first use. No document pixels or recognized text are
sent with those downloads. OCR output is editable and must be proofread. Photo
presets are starting points, not universal official requirements or acceptance
certification. Invoice arithmetic is not tax compliance or e-invoice registration.

HEIC uses the version-pinned LGPL decoder as a separate, replaceable public ES
module, not bundled into application chunks. `scripts/sync-heic-assets.mjs`
copies the unmodified module, license, and README before dev/build. Source links
and notices are in `public/third-party/heic-to-NOTICE.txt`. Preserve notices and
applicable upstream source access when distributing modified versions.

## Search and Measurement

Routes are statically rendered with their actual workspace controls, one h1,
unique metadata, self-canonicals, breadcrumbs, and truthful WebApplication data.
The homepage directory exposes all tools as crawlable anchors; no search query
or login is needed to reach a specific tool. Do not redirect search arrivals to
the homepage or create thin pages for minor keyword variants.

See [analytics coverage and setup](../SEO_ANALYTICS_README.md). Events contain
fixed identifiers and categorical outcomes only. Never send inputs, filenames,
customer details, QR payloads, draft text, or raw exception messages.

## Verification

Run `npm run lint`, `npm test`, `npm run build`, and `npm run test:browser`.
`tests/browser/expanded-tools.spec.ts` exercises direct mobile/desktop landings,
actual HEIC decoding, image OCR, PDF extraction, generated downloads, QR decoding,
input errors, cancellation, stale-result clearing, and size-limit reporting.
The generated HEIC fixture has source attribution in `tests/fixtures/README.md`.
Only synthetic test data is used; no actual tester or trading data is involved.

## October 21 Tool-State Audit

Ten new reproductions failed against the previous export before fixes were applied.
The shared Base64 text encoders, source decoders, and binary decoders now clear
results, copy feedback, and errors when input changes. Old preview blob URLs are
revoked, so an edited input cannot leave the previous file available for download.
Clipboard feedback ignores completions from an older input, older copy attempt,
or an unmounted tool; pending clipboard writes themselves cannot be cancelled.

Shared inputs now have accessible names and descriptions, output fields have names,
and tool errors are announced. Source decoders say Copy decoded text rather than
incorrectly calling the decoded output Base64. The PDF page-list field is labelled.

The PDF splitter and page extractor lock file/range controls during an export,
guard duplicate starts, and discard late downloads/errors after unmounting. This
does not forcibly stop pdf-lib CPU work, but leaving the tool cannot trigger a
subsequent file download. The shared PDF picker also ignores disabled change events.

Verification: lint, 34 unit tests, the production build/static audit, and 198 browser
checks passed, including 13 focused state, clipboard, preview cleanup, accessibility,
and delayed-PDF cases. Four opt-in live-service tests were skipped in the local run.
`npm audit --omit=dev` reported zero known vulnerabilities. A live health check returned
200 with LibreOffice, qpdf, and OCR engines available; this alone is not proof that
every conversion format or every input file works. Tester records and trading storage
were not read or changed.
