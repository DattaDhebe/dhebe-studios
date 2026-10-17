# Tool Audit, 17 October 2026

## Verification

- Production static export builds successfully (123 routes).
- 89 browser regression tests pass, including responsive UI, multi-page PDF OCR, compression,
  editing, merge/split/page tools, image operations, all Base64 source types,
  calculator initialization, and email persistence/undo.
- Nine shared-library tests pass for Base64 validation, large payloads, calendar
  boundaries, page ranges, and numeric calculation edge cases.
- Nine conversion-service integration tests pass on the VPS, covering actual
  DOCX/PPTX/XLSX input/output, searchable OCR, PDF/A-2b, AES-256 encryption,
  repair, background removal, request validation, polling, and temporary cleanup.
- Three public-site smoke tests pass: real DOCX conversion, Compress PDF, and
  Optimize PDF. Both rendering tools load a version-matched JavaScript worker
  with an executable MIME type and produce readable downloads.
- All 36 interface checks also pass against the published website, covering
  search, filters, keyboard access, themes, contrast, and responsive layouts.
- Lint and whitespace checks pass; the existing trading dashboard responds
  normally, and its worker containers remain healthy.
- npm audit reports zero known vulnerabilities after the PDF.js security upgrade.

## Fixed

PDF.js assets now come from the installed version and are synchronized before
development/build. Worker, CMaps, standard fonts, and WASM use versioned paths.
The module worker is published with a .js filename because shared hosting serves
.mjs files as text/plain; local browser tests reproduce that MIME restriction.
Compression preserves page size, releases render resources, and keeps the
original when recompression is larger. Multi-page JPG export uses a single ZIP.
The PDF editor renders the selected page on a canvas and converts clicks to PDF
coordinates, including rotated page transforms. OCR handles every page and
outputs a searchable PDF. Page parsing rejects partially valid selections.

Image tools share guarded canvas processing and release preview URLs. JPG
conversion uses a white background, crop bounds remain inside the image, batch
resizing preserves each image's own ratio, and downloads use the actual format.
Base64 decoding validates padding, handles large ASCII payloads, and rejects
preview MIME mismatches. Uploads and input controls wait for hydration. Email
designs persist locally, undo is deterministic, nested buttons are removed, and
HTML preview is sandboxed. Date durations use calendar months; invalid numeric
and future-date inputs no longer produce misleading calculation results.

## Server Conversions

Approved service: `https://tools.dhebe.com/api/tools`, on the existing VPS at
`200.234.47.229`, under `/opt/dhebe-tools`. Existing trading workers retain their
running containers and configuration. Caddy has an additive tools host and a
graceful reload; the original proxy configuration is backed up.

Office imports, native document exports, PDF/A, repair, password encryption,
and background removal use the isolated service. Sources are deleted after
processing. Results wait in memory for up to five minutes or until downloaded.
The UI explains uploads. Limits: 25 MB inputs, 150 PDF pages, two processing jobs
and two queued jobs. See `services/tools/README.md` for operations.

PDF to Word extracts text into DOCX; complex layout reconstruction is outside
this implementation. PowerPoint export uses one PDF page image per slide.
Excel extracts detectable tables and otherwise exports text rows. HTML import
uses LibreOffice's supported HTML layout, with external resources unavailable.
PDF/A generation is checked for identification metadata and an output intent;
formal third-party conformance certification is not included.

The static frontend is published as a file overlay. Existing `trade`, `api`,
and `ai_lead_agent` directories on shared hosting are preserved.

## Interface Refresh

The homepage now has a functional tool finder, category filters, and direct
shortcuts. Shared navigation, self-hosted typography, warm-neutral surfaces,
and studio-specific accents replace inconsistent layouts. PDF, image,
calculator, and Base64 tools share one searchable sidebar and a larger canvas.
Mobile tool lists collapse, keeping uploads and inputs near the top. Oversized
Base64 and email introductions no longer sit above the workspaces.

Keyboard focus, skip navigation, file selection, reduced-motion preferences,
dark-mode persistence, blocked browser storage, and selected email-control
contrast have regression coverage. Layout checks cover 390px, 768px, and 1280px.
The email preview and conversion algorithms retain their existing behavior.
