# PIE.PE 3.1 — Google Search Console redirect investigation

## Evidence and limits

Owner's November 13 “Pāradresācijas kļūda / Redirect error” email contains no example URL, crawl date or Google-selected canonical. The owner subsequently supplied `https://pie.pe/en`; the latest Issue #32 scope-freeze addendum assigns that specific investigation to **3.1.1, Issue #34**. The3.1 audit already records GET and HEAD `/en` →307 Location `/en/` →200 in one hop. No current redirect error is reproduced there, and no speculative remediation is added to3.1. Crawl timestamps and account-only URL Inspection/Live Test results are still unavailable. **Exact historical Google-reported root cause remains unconfirmed.** A successful current audit cannot establish that a historical Google failure was fixed or guarantee indexing.

[Before: real production chains](qa/v310/redirect-before.json), [candidate: actual local Workers Static Assets](qa/v310/redirect-candidate.json). Each includes raw HTTP status lines, Location, terminal address/status, method and timing. Production audit covers 110 GET/HEAD chains: all twenty sitemap canonicals resolve directly to 200; meaningful slash, index, query, encoded and HTTP variants end within one hop; unknown pages remain 404. GET/HEAD agree; query strings survive. Candidate has the corresponding 106 chains (local HTTP has no public TLS scheme transition).

The existing Cloudflare asset slash normalization uses 307 and remains unchanged. This ordinary redirect is not proof of Google's separate “Redirect error” classification. No failing/looping intended canonical or canonical/hreflang-to-redirect was found. Sitemap, robots, canonical/hreflang graph and legacy known aliases were audited without manufacturing nonexistent old slugs. WWW public DNS A and CNAME answers were NXDOMAIN, so no unconfigured www redirect is invented.

[Sanitized read-only edge observations](qa/v310/edge-summary.json): apex custom domain belongs to existing `piepe` Worker; Always Use HTTPS is on; no extra Worker routes returned. API reads for DNS details, Page Rules, zone/account rulesets and bulk redirect lists return 403 with the available credential. These rules are **unobservable**, not proven absent. No edge rule, domain, security setting, Worker identity, routing or deployment integration was changed. The media Worker was not implicated or rewritten.

The new reusable `scripts/redirect-graph.mjs` verifies no loops, malformed/empty/downgrading/unexpected-origin Location, excessive hops, method disagreement, discarded query, canonical redirect or broken reciprocal hreflang. Tests cover malformed/deceptive URL cases as well. The new same-tab navigation policy uses the same canonical destinations without introducing a client redirect layer.

## Owner account steps

1. Search Console → Indexing → Pages → **Redirect error / Pāradresācijas kļūda** → Examples. Copy/export the exact URLs and Last crawled date. Include the property's scheme/host and any old slug.
2. Inspect each exact example using the top **URL inspection** bar. Record indexed status, referring page and user/Google-selected canonical. Choose **Test live URL**, then View tested page → HTML/Screenshot/More info. Save the results with UTC time; these are account-restricted screenshots and cannot honestly be fabricated in this repository.
3. Compare the exact flagged chain against the audit at that crawl time. A normal intentional redirect belongs under “Page with redirect”; a still-failing loop requires a precise rule fix. Do not redirect real 404s to home or submit every alias for indexing.
4. After any specific current defect is corrected and the Live Test succeeds, return to the original Redirect error report and select **Validate fix**. Request indexing for the final canonical where appropriate. Google schedules recrawling/validation; success is not immediate.
5. Confirm sitemap `https://pie.pe/sitemap.xml` still lists twenty direct-200 canonical URLs. No extra sitemap or speculative AI markup is needed.

Final production release receipts are maintained in [PR #33](https://github.com/aigars-avotins/piepe/pull/33). No “Google issue fixed” claim is made without crawl/account evidence; the specific `/en` follow-up belongs to #34 and does not delay an otherwise passing3.1 release.
