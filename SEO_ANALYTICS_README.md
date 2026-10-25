# Search Visibility and Analytics

## Production Setup

- Canonical host: `https://www.dhebe.com`.
- GA4 measurement ID: `G-D9BJ344ZDV`; property `532896909`, web stream `14368203624`.
- Public sitemap: [sitemap.xml](https://www.dhebe.com/sitemap.xml).
- Search Console URL-prefix property: `https://www.dhebe.com/`.
- Search visibility is not guaranteed: a sitemap helps discovery, while Google decides indexing and ranking.

## Analytics and Privacy

Implementation: [components/analytics.tsx](components/analytics.tsx) and [lib/analytics.ts](lib/analytics.ts).
Google Analytics loads only on the production host after an explicit opt-in.
The browser choice is stored under `dhebe-analytics-consent-v1`.
Do Not Track and Global Privacy Control override opt-in. Local previews never transmit analytics.
Visitors can withdraw through the footer's Cookie preferences button; this disables future events and clears GA cookies.
No advertising personalization or Google signals are enabled by this tag.

Events are one `page_view` per canonical pathname navigation, `tool_select` for workspace/homepage selections,
`tool_download` with the fixed tool ID and file format, and `tester_signup` after a confirmed signup.
The eight new workflows, QR generation, and PDF compression also emit operation-level
`tool_start`, `tool_success`, and `tool_error`; errors carry only `processing_failed` or `cancelled`.
Legacy PDF, image, Base64 text, and email export controls now use the shared download helper;
the binary decoder records the same format-only event while reusing its preview URL.
An event records an initiated download, not proof that the visitor saved a file. A successful
operation means a valid result was produced, not that a PDF target was achievable or OCR was error-free.
Legacy live calculators and some older operations do not yet emit the full start/success/error funnel.
Never add email addresses, filenames, file contents, tool inputs, search terms, query strings, or URL fragments.
The website notice is at [/privacy/](https://www.dhebe.com/privacy/). The Android app has a separate policy.

Milan referrals use `website_select` only after consent, with `website_id=milan`
and one allowlisted placement: `featured`, `footer`, or `search`. No destination
query, biodata, photo, form value, or search term is attached. These parameters
remain available in the event payload; no new GA4 custom dimension is claimed.

## October 25 Milan Referral and Canonical Cleanup

- Added one compact Marriage Biodata card in the sixth studio-grid position,
  matching the existing cards rather than creating a large separate section.
  It opens the existing Milan website at `https://shaadi.dhebe.com/` in a new
  tab. No biodata editor or duplicate keyword landing pages were added here.
- The footer links to Milan, and the finder
  labels this result as a separate website. The tool directory still lists the
  same 77 local tools; the main sitemap contains 94 canonical DHEBE pages.
- Homepage title, description, share image, and linked WebSite/WebPage/ItemList
  structured data describe the actual catalog. The external Milan URL is not
  falsely treated as the canonical URL of a DHEBE Studios tool page.
- `scripts/static-search-config.mjs` generates allowlisted public redirects:
  known `index.html` copies and legacy aliases lead to clean canonical URLs.
  Explicit-request guards prevent internal DirectoryIndex loops, and host
  guards exclude separately managed subdomains. APIs and route-data files keep
  noindex headers; private or unrelated paths are not redirected to home.
- Sitemap `lastmod` changes only for the substantively updated homepage and
  website privacy notice, not every unchanged tool on a rebuild.
- Before publishing, lint, 40 unit checks, the build/static audit, and 59
  affected browser checks passed. Browser analytics requests were intercepted;
  no synthetic events were sent to production Google Analytics.
- Search Console's www URL-prefix report inspected on October 25 was last
  updated October 16: 30 indexed, 86 excluded (15 noindex, 13 redirects, 2
  malformed 404 URLs, 40 crawled-not-indexed, 16 discovered-not-indexed). It
  predates this release and does not establish post-release indexing. The two
  404 examples are `/&` and `/$`; they should remain 404, not soft-homepages.

### October 25 Live and Google Verification

- Published 958 allowlisted static files, then applied the reviewed canonical
  configuration separately. Kept a local rollback copy of the previous rules;
  no backend code, database, credentials, or separately hosted app was uploaded.
- The live audit checked all 94 sitemap URLs: HTTP 200, unique titles and
  descriptions, one primary heading, self-canonicals, valid JSON-LD, and no
  accidental noindex. All 84 referenced Next runtime assets returned 200.
- Verified direct 301s from `/index.html`, `/compress-pdf/index.html`, and the
  legacy `/pdf-tools/compress-pdf/index.html` to their clean canonical URLs.
  Junk `/&` and `/$` paths still return 404. Route data and tester-list APIs
  return `X-Robots-Tag: noindex` without blocking the public HTML pages.
- Milan's homepage and the RivetPrep/RosterCairn app privacy pages returned 200
  and matched the byte hashes captured before this deployment. Their application
  files and data were not changed.
- Resubmitted `https://www.dhebe.com/sitemap.xml` in the www URL-prefix property.
  Google confirmed success, last read October 25, and **94 discovered pages**.
  This is discovery, not an indexed-page count.
- Homepage URL Inspection reported **URL is on Google**. After publication,
  Google accepted one new indexing request and confirmed the URL was added to
  its priority crawl queue. This is not confirmation that the new content has
  already been indexed or that its ranking has improved. No repeated request,
  CAPTCHA solution, or challenge bypass was performed.
- Temporary upload archives were moved to recoverable hosting Trash. Live
  verification receipts and screenshots remain in ignored local release/test
  directories; private content and credentials were not committed.
- Final layout refinement replaced the initial standalone panel with the compact
  sixth studio-grid card, preserving the original header and global layout.
  The final build/static audit, lint, 40 unit checks, and **237 browser checks**
  passed; four opt-in live-service checks were skipped. Tests verify the exact
  second-row/third-column desktop position, category filtering, mobile layouts,
  new-tab behavior, and consent-only measurements. The static-only refinement
  left the already verified canonical configuration unchanged and did not send
  another indexing request for the same homepage.

Indexing requests and sitemap submission are recorded separately from actual
indexing. No first-position ranking, rich result, or indexing deadline is
promised. Google decides which pages to crawl, index, and serve. Milan's own
SEO, Search Console property, sitemap, and application remain outside this
repository and this release's scope.

In GA4 Admin > Data streams > dhebe > Enhanced measurement, disable history-based page views,
site search, form interactions, outbound clicks, video engagement, scrolls and automatic file downloads.
Manual sanitized page views avoid double-counting. Automatic measurement must not reintroduce user input.
These enhanced-measurement switches were saved in the signed-in production stream on October 18, 2026.
Page-load measurement remains enabled in GA4, while the tag uses `send_page_view: false` and emits manual views.

## October 19 Tool Expansion

Eight dedicated, statically rendered tools are listed in [the implementation guide](docs/UTILITY_TOOLS.md).
The sitemap contains 90 canonical pages. All 77 unique tools have ordinary HTML links in the
homepage directory, independent of JavaScript search. Circle Calculator is listed once.
Every indexable page must have a unique title/description, a self-canonical, one primary heading,
valid structured data, a sitemap entry, and a crawlable link path from home; the build enforces this.
Base64 encoder and decoder category links were repaired after the crawl audit found them orphaned.
There is one useful page per workflow, not one near-duplicate page for every KB or keyword variation.

At the October 19 release, account-side reporting was still pending. A read-only account check on
October 21 confirmed event-scoped custom dimensions for `tool_id`, `studio`, `file_type`, and
`error_code`, each last changed October 20. The existing GA4 stream `14368203624` is linked to the
`dhebe.com` Search Console domain property (linked May 1, 2026); this differs from the www URL-prefix
property used for the checks below. Compare starts/results by tool and device alongside landing-page views.
Do not compare start/success counts as a complete all-tool completion rate: coverage is stated above,
visitors may repeat operations, and opt-out, privacy signals, and blockers exclude some activity.
Use Search Console Pages/Queries over 28 and 90 days for actual search performance. The existing
submitted sitemap URL stays the same; Google may reread it, or its owner can resubmit it.
Sitemap inclusion and valid metadata do not guarantee indexing, rankings, or a rich result.

## October 19 Release Verification

- Deployed 1,025 selected static files (17,926,732 bytes), retaining existing assets and unrelated hosted applications.
- Confirmed representative live HTML and the HEIC decoder match the tested export; the live sitemap lists 90 canonical pages.
- Verified apex-to-www and trailing-slash redirects, real 404 responses for unknown tool URLs, and noindex headers on decoder assets.
- Passed lint, 33 unit tests, the production build and exported-page audit, and 176 local browser checks; 4 opt-in server-service checks remained skipped.
- Covered all 45 release scenarios on the live site. Cold PDF engine loads and client navigation exceeded initial five-second assertions; bounded waits and an enabled-picker check fixed the test timing. The final full run passed 44 cases, and the remaining finder case passed twice in focused reruns.
- Used synthetic browser-only documents, images and QR details. Analytics tests intercepted Google requests; no real signup, payment, broker order or trading-state change occurred.
- Preserved private tester/trading storage and the unextracted `dhebe-seo-webroot.zip`. No new VPS service or database was installed.
- No new GA4 Admin change, Search Console submission, indexing count or ranking improvement is claimed for this release.

## October 21 Search Follow-up

### Google Account Verification

- Resubmitted `https://www.dhebe.com/sitemap.xml` in the www URL-prefix property. Google confirmed submission, then showed Success, last read October 21, and 90 discovered pages. This is not an indexed-page count.
- The Page Indexing report still showed 35 indexed and 82 excluded URLs, with a last-update date of October 12. It predates the new tools and cannot establish their current indexing status.
- URL Inspection found `/json-formatter/` discovered but not indexed; a request to index it failed with Google's reCAPTCHA-service connection error. No successful indexing request or CAPTCHA bypass is claimed.
- `/photo-signature-formatter/` was reported as unknown to the index at inspection time. Its live page and sitemap entry exist; discovery and indexing reports can lag. No repeated indexing requests were sent.
- Confirmed the four GA4 dimensions and existing Search Console integration without changing consent, enhanced measurement, privacy settings, or account access.

### Measured Priorities

Search Console Web performance for September 22 through October 19 showed 1.73K impressions,
2 clicks, 0.1% CTR and average position 52. These are rounded displayed totals, not forecasts.
The report ends on the new-tool release date, so it cannot measure those tools' post-launch effect.

| Priority Page | Impressions | Clicks | Implemented Improvement |
| --- | ---: | ---: | --- |
| `/email-template-editor/` | 317 | 0 | Specific HTML editor metadata, practical workflow instead of keyword lists, inbox-testing caveats, links to image preparation tools |
| `/split-pdf/` | 288 | 0 | Accurate continuous-range instructions, examples, accessible field labels, and a link to the separate non-consecutive-page tool |
| `/tools/base64-to-image/` | 253 | 1 | Preview/download intent, MIME-prefix guidance, raw-PNG default and explicit distinction between decoding and format conversion |

The shared Base64 landing guide now shows capabilities instead of repeated keyword chips.
Only the substantively refreshed email, splitter, and Base64 guide URLs receive an October 21
sitemap `lastmod`; unchanged pages retain their previous date. Existing canonical paths, redirects,
noindex rules, and direct tool entry points are preserved. No new keyword-variant pages were added.

Validation: lint, 34 unit tests, the production build/static audit, and 185 browser checks passed.
Four opt-in live-service checks were skipped. The nine new checks cover direct mobile/desktop
landings, useful workflow links, decoder limitations, and a real two-page range extraction.
The upload client also validates the returned same-origin TUS location, restores Hostinger's
missing `/rest` gateway prefix, drops the create-only override flag for PATCH, drains responses,
and checks every chunk offset. It compares decoded path segments so Next.js dollar-sign filenames
can round-trip through Hostinger without allowing encoded slashes to change the target. It never
forwards credentials to a different origin or target file.

### Follow-up Measurement

Review comparable complete 28-day windows after sufficient post-release data accumulates.
Prioritize relevant query/page impressions alongside position, device and country; do not assume
low CTR is only a title problem. Inspect individual important canonical URLs when Google's
challenge service is available, without repeated requests for the same URL or bulk submission.
Do not remove valid redirects/noindex exclusions merely to make the exclusion count smaller.

## Indexing and Hosting

`app/sitemap.ts` lists only canonical, public, indexable pages. Its fixed last-modified date reflects
published content, not build time. Update that date for substantive content releases.
Legacy aliases stay out of the sitemap and point to their replacements.
Hostinger's generated `out/.htaccess` provides permanent redirects for those aliases and the canonical host,
plus long-lived caching only for content-hashed Next static assets. It must not replace existing server rules
without review. The build rejects malformed canonical URLs, missing headings, broken internal links, invalid JSON-LD,
missing social images, and noindex URLs in the sitemap.

Search Console snapshot on October 18, 2026: 35 indexed, 82 excluded (16 noindex aliases,
13 redirects, 2 malformed 404 addresses, 35 crawled-not-indexed, 16 discovered-not-indexed).
Do not remove intentional noindex tags or turn malformed paths into duplicate homepages.
After deployment, resubmit the sitemap and inspect representative canonical URLs.
Google may take time to recrawl and is not required to index every page.

## October 18 Release Verification

- Published 957 static assets, route-data files, pages, and indexing/configuration files without upload failures.
- Confirmed the root `.htaccess` was absent before installing the generated rules; unrelated hosted applications and APIs were not replaced.
- Verified HTTPS apex-to-www and legacy-alias 301 responses, correct 404 responses for malformed addresses, and immutable caching for hashed assets.
- Confirmed live HTML, sitemap and robots files match the release build. Hostinger re-encodes the PNG preview without changing its 1200 x 630 pixels.
- Resubmitted the sitemap in Search Console: Success, last read October 18, 2026, 82 discovered pages. Discovered does not mean indexed.
- Verification: 24 unit tests, 130 local browser checks (4 opt-in live-service checks skipped), 12 final focused browser checks, and 38 live-site browser checks passed.
- Browser tests used synthetic documents and mocked tester submissions; no real tester record was added, read, or migrated.

## Verification

```sh
npm run lint
npm test
npm run build
npm run test:browser
```

The postbuild audit checks every exported canonical page. Browser analytics tests intercept Google requests;
they never send real visitor information or create tester records.
