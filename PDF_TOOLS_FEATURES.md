# Dhebe Studios PDF Tools

PDF Studio combines browser-side document tools with explicitly labeled server
conversions. Open [PDF Studio](https://www.dhebe.com/pdf-studio/) or a dedicated
tool page. The tool registry and page mappings live in `lib/pdf-tools.ts` and
`lib/pdf-tools-pages.ts`.

## Browser workflows

| Workflow | Behavior |
| --- | --- |
| Merge | Combine selected PDFs, reorder inputs, and remove files before export |
| Split and extract | Select page ranges; invalid or fractional page selections are rejected |
| Remove and organize | Delete selected pages or change page order |
| Compress and optimize | Recompress rendered pages; retain the original when the result is larger |
| JPG and scan to PDF | Build a PDF from selected images |
| PDF to JPG | Render pages; multi-page output is packaged as a ZIP |
| Edit and sign | Add text overlays or a typed signature; original text is not reconstructed |
| Rotate, crop, page numbers, watermark | Apply the chosen page transformation or overlay |
| OCR | Recognize pages in the browser and export a searchable PDF |
| Text export | Extract selectable text; scanned pages need OCR first |

Compression preserves page dimensions but rendered recompression can flatten
selectable text and interactive content. Browser processing depends on available
memory and device capability; large inputs are not guaranteed to succeed.
Text overlays and typed signatures use PDF standard fonts, so not every script
is supported. A typed signature is not a certificate-based digital signature.

OCR may download recognition assets, but the browser workflow does not upload
document content. PDF.js workers, fonts, CMaps, and WASM are synchronized from the
installed package and served through versioned paths.

## Server conversions

Server processing is identified in the interface before users choose to
convert. The isolated API supports these conversion families:

| Conversion | Scope |
| --- | --- |
| Office to PDF | Word, PowerPoint, Excel, OpenDocument, and supported CSV inputs |
| HTML to PDF | LibreOffice-supported HTML, not a full browser rendering engine |
| PDF to Word | Selectable text exported to DOCX; complex layout reconstruction is not included |
| PDF to PowerPoint | Each PDF page becomes an image on a slide |
| PDF to Excel | Detectable tables or selectable text rows; scanned pages need OCR |
| PDF/A | PDF/A-2b output with metadata/output-intent checks, not third-party certification |
| Repair | Attempt repair with qpdf; not every damaged PDF can be recovered |

The API also supplies AES-256 password protection and OCR capabilities; available
frontend entry points are determined by the tool registry. Do not infer a
published route from an API capability alone.

Inputs are limited to **25 MB** and PDFs to **150 pages**. The service allows two
processing jobs and two queued jobs. Temporary source/result files are deleted
after processing; prepared downloads wait in memory for at most five minutes or
until downloaded. The client enforces one overall conversion deadline, supports
cancellation, and validates the returned output type and filename extension.

See [the conversion service guide](services/tools/README.md) for supported
extensions, isolation, integration tests, and deployment boundaries.

## Validation and failure states

Replacing an input clears stale PDF selections. A failed replacement cannot
silently reuse the previous document in the page tools. Page selection rejects
invalid ranges instead of partially parsing them. Server failures and invalid
responses show errors without producing misleading downloads.

PDFs must be readable and, where required, unlocked. Output fidelity depends on
the source format and the selected operation. Keep a copy of the original when
editing, compressing, or converting a document.

## Testing and deployment

Run `npm test`, `npm run build`, and `npm run test:browser`. Browser regressions
exercise generated PDFs, output structure, invalid selections, cancellation,
timeouts, and the version-matched worker. Live integration checks use generated
non-personal fixtures and are opt-in.

Follow [the deployment guide](PDF_TOOLS_DEPLOYMENT.md) to publish the static
frontend without replacing APIs, private storage, or unrelated hosted
applications. License and attribution terms remain in [LICENSE](LICENSE).
