# PIE.PE 3.1.1 — exact `/en` Search Console investigation

## Finding

The owner supplied the exact affected URL, `https://pie.pe/en`, and **Last crawled: 2026-10-29**. That crawl predates the deployed 3.0/3.1 releases. The Search Console account, Google's selected canonical and a current “Test live URL” result are not available to this environment. A historical/transient failure is possible; its cause is **unreproduced**, not proven fixed.

Fresh external probes on 2026-11-14, before implementation, show:

| Request | Observed response | Destination |
| --- | --- | --- |
| GET / HEAD `https://pie.pe/en` | 307, `Location: /en/` | 200, English HTML, self-canonical `https://pie.pe/en/` |
| GET / HEAD `https://pie.pe/en/` | 200 directly | Same canonical; reciprocal LV/EN/x-default alternates |
| Slashless HTTPS URL with query | 307; query retained | Canonical page 200 |
| `http://pie.pe/en` | 301 HTTPS upgrade, then 307 slash normalization | 200; two intentional normalization steps |

Mozilla and Googlebot-like user agents give the same healthy exact-HTTPS behavior. A Googlebot-like user agent is a diagnostic comparison, **not an impersonation of Google's verified crawler or a Search Console inspection**. The full redirect graph checks 110 GET/HEAD chains and all 20 canonical routes, with no loops, broken destinations, noindex or wrong-language canonical. The sitemap correctly lists only `/en/`, never slashless `/en`.

**No redirect, Worker, zone rule, canonical, sitemap or security change is justified.** A legal 307 is not itself a Search Console “Redirect error.” No claim is made that this release repairs Google's old crawl record or guarantees indexing.

## Reproducible checks

```sh
node scripts/redirect-graph.mjs --origin https://pie.pe --out /tmp/piepe-redirects.json
curl -sS -A 'Mozilla/5.0' -D - -o /dev/null https://pie.pe/en
curl -sSI -A 'Mozilla/5.0' https://pie.pe/en
curl -sS -A 'Mozilla/5.0' -D - -o /dev/null https://pie.pe/en/
```

Before-release evidence: [exact URL/method/UA traces](qa/v311/google-en-before.json), [complete redirect graph](qa/v311/redirect-before.json). Native macOS final validation also probes the exact public URL from the independent GitHub runner network and attaches response/edge/date evidence. Production receipts are linked from the release PR after deployment.

## Owner's Google-account steps

1. Inspect **both** `https://pie.pe/en` and `https://pie.pe/en/`. Run **Test live URL**, record its time and result. A redirecting slashless alias need not be independently indexed.
2. For `/en/`, check successful fetch, indexing permission, rendered English content and Google's selected canonical. Compare the live result with the October 29 historical crawl.
3. If live tests succeed, use **Validate fix** in the original redirect-error report where available. Request indexing for the **slash canonical**, not the redirect alias; allow Google time to recrawl.
4. Confirm the submitted sitemap is `https://pie.pe/sitemap.xml`. Resubmission is optional when it already succeeds and is unchanged.
5. If a new live failure occurs, save the affected exact URL, time, raw result/HTML and selected canonical. Diagnose that reproducible failure rather than switching all legal redirect status codes speculatively.

Physical device Safari, Google account security, registrar transfer lock/MFA and DNSSEC ownership settings are not certified by browser or HTTP tests. Do not infer them from the absence of a public routing failure.
