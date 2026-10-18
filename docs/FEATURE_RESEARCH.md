# Feature Research - October 18, 2026

## Selection

These are evidence-informed candidates, not a claim of measured search volume or guaranteed traffic.
No keyword-volume account was available. Actual impressions, clicks and usage should determine subsequent investment.
They extend the existing image/developer toolkit without increasing VPS processing or document storage.

| Feature | Evidence and fit | Implementation |
| --- | --- | --- |
| Image size in KB | Current SSC guidance includes a 10-20 KB JPEG signature requirement; Adobe also maintains size-limit-specific compression workflows. This validates the upload-limit problem, not a claim that every form has the same requirements. | One useful page with configurable 20/50/100/200/500 KB presets, decimal KB accounting, quality/dimension reduction, final preview and size. No duplicate landing page per limit. |
| Static QR generator | Canva offers URL QR creation, PNG/SVG downloads, and dynamic-code management. A lightweight static, no-account, no-tracking alternative fits the existing browser-first tools. | Website/text modes, fixed high contrast and quiet zone, PNG/SVG download, input validation, scan-test reminder. No hosted redirects or scan analytics. |
| Word/character counter | WordCounter documents character, paragraph, reading-time and speaking-time workflows. This complements the text/Base64 and email tools and can serve repeat use. | Live language-aware counts, Unicode character handling, timing estimates, no draft persistence or server upload. |

## Sources

- [SSC 2026 Combined Hindi Translators notice](https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cht_2026.pdf).
- [Adobe PDF compression for upload limits](https://www.adobe.com/in/acrobat/online/compress-pdf-100kb.html).
- [Canva QR generator](https://www.canva.com/qr-code-generator/).
- [WordCounter details](https://wordcounter.net/blog/2015/11/07/10850_word-counter-details-options.html).
- [QR encoder's official documentation](https://github.com/soldair/node-qrcode).
- [MDN Intl.Segmenter reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter).
- [Google's doorway/scaled-content policies](https://developers.google.com/search/docs/essentials/spam-policies).

## Measure Before Expanding

Compare these canonical pages in Search Console over at least several weeks: impressions, clicks,
queries, country and device. Use opt-in GA4 page views, tool selections and supported downloads as directional signals,
not a full visitor census. Consent refusal and blockers reduce measured counts.
Do not fabricate reviews, traffic counts or rankings, buy backlinks, or mass-generate pages for minor keyword variants.
PDF target-size compression is a possible later enhancement, but must not promise an impossible size or silently
rasterize documents and remove selectable text, signatures, or accessibility information.
