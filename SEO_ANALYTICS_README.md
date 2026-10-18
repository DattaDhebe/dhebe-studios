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

Events are one `page_view` per canonical pathname navigation, `tool_select` for workspace selections,
`tool_download` for downloads using the shared helper (format only), and `tester_signup` after a confirmed signup.
Not all legacy download controls use the shared helper; these events are not a complete count of every export.
Never add email addresses, filenames, file contents, tool inputs, search terms, query strings, or URL fragments.
The website notice is at [/privacy/](https://www.dhebe.com/privacy/). The Android app has a separate policy.

In GA4 Admin > Data streams > dhebe > Enhanced measurement, disable history-based page views,
site search, form interactions, outbound clicks, video engagement, scrolls and automatic file downloads.
Manual sanitized page views avoid double-counting. Automatic measurement must not reintroduce user input.
These enhanced-measurement switches were saved in the signed-in production stream on October 18, 2026.
Page-load measurement remains enabled in GA4, while the tag uses `send_page_view: false` and emits manual views.

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
