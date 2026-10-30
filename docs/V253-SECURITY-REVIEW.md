# PIE.PE public-repository credential review — 2026-10-30

**No confirmed credential exposure or immediate rotation finding was identified in the reviewed material.** Secret values are omitted from this report and scan summaries. Two automated candidates are the same public Cloudflare Web Analytics browser-beacon identifier in an old production browser log, not a privileged API credential; no rotation is indicated for those identifiers.

## Scope and method

Repository visibility was verified as public. Fetched all available heads, tags and pull-request heads without resetting local work: **121 reachable commits, nine remote heads, six PR heads, no tags**. Audited the Git patches and commit messages, and independently scanned **531 non-media historical blobs out of 786**, expanding **44 gzip QA reports** that a text-only Git diff scan could miss. Current source and deleted/changed historical text files are included.

Downloaded the logs for **all 133 listed Actions runs**, covering 2026-10-27 through 2026-10-30: **430 log files / 7,535,107 bytes**, none unavailable. Also scanned all 16 public issue/PR bodies, eight issue comments, zero review comments and zero releases returned by the API. Only local scans and read-only GitHub requests were used for this review; no Actions run was launched for security scanning.

Used Gitleaks **8.30.1**, downloaded from its official release and checked against its release SHA-256 manifest, with default rules, 100% value redaction and repository allow-comments/ignore files bypassed. No scanner/runtime dependency was added to PIE.PE. Supplementary local checks examined sensitive assignments, literal Authorization bearer values, credential-bearing URLs, private-key headers and sensitive historical filenames. Candidate lines were reviewed only through redacted context. No candidate credential was used to authenticate or tested against a service.

## Findings

| Surface | Automated candidates | Review |
| --- | --- | --- |
| Git patches and commit messages | 0 | No detected credential exposure. |
| All historical non-media blobs, including expanded QA reports | 0 | No detected credential exposure; no tracked historical `.env`, `.dev.vars`, private-key or credential-file names. |
| Public Actions logs | 2 | Both in [run 40562586138](https://github.com/aigars-avotins/piepe/actions/runs/40562586138): Cloudflare's public client-side analytics beacon identifier. Confirmed browser-beacon script/context and 32-hex identifier format; value omitted. No API access or rotation requirement. |
| Supplemental credential patterns and public discussions | 0 | No additional candidate. |

Cloudflare account IDs, deployment/version UUIDs, public media hashes and browser analytics identifiers are not authentication secrets. Their presence alone does not warrant credential rotation. Configured runtime credentials and ignored local environment files were not printed or inspected to obtain their values.

The existing workflow grants **`contents: read`**, has no `pull_request_target` trigger or `secrets.*` expression, and quotes the optional diagnostic filter through an environment variable. Standard runners are `ubuntu-24.04` and `macos-15-intel`. No larger runner, automatic browser suite, new permission, weakened assertion, changed release-concurrency policy or changed Cloudflare deployment integration was introduced.

## Limits

GitHub's secret-scanning-alert and code-security-configuration APIs both returned **403**. This audit therefore does not assert that GitHub's own scanning is enabled or that its alert list is empty. The owner can inspect the repository Security settings/alerts directly.

The 255 binary media blobs were excluded from credential text scanning. Remote Actions artifact metadata was inventoried (125 unexpired artifacts), but not every video/trace archive was downloaded and audited in full; the 44 committed compressed reports were expanded and scanned. Unknown unreachable GitHub objects, fork-only history and undisclosed credentials outside the repository are outside this inventory. Pattern scanning and review reduce uncertainty; they are not proof that every novel secret format is absent.

[Value-free machine-readable scope/results](qa/v253/public-security-review.json). Raw downloaded logs and scanner working files remain outside the repository; no secret-bearing evidence is added to Git.

## Release boundary

PR #16 remains unmerged and production remains 2.5.2. The owner's latest instruction permits necessary validation on **standard** GitHub-hosted Ubuntu/macOS runners now that the repository is public; paid larger runners remain prohibited. The previous Chromium 152/152 result remains applicable because application code is unchanged. One final native-only full validation is justified by the previously interrupted full attempt and corrected clock observer; no duplicate full Chromium run is needed. Native failures, if any, must remain visible. Merge and production deployment still require new owner approval.

## Follow-up after final native validation

Downloaded and scanned the two new Actions run log archives (39 additional files) and **33 textual new native artifact/trace streams**. No credential candidate was found. Together with the initial review, **135 run log archives / 469 files** have been scanned at this cutoff. Extra checks for shorter password/API-key literals, Basic authentication, `x-auth-key`, `x-api-key` and `_authToken` also returned zero candidates. No rotation finding was introduced by the final validation. This does not claim to cover future Actions logs.

The final native run completed all 152 cases: **147 passed, four failed, one expected skip**; every new 2.5.3 case passed. [Detailed native QA](V253-QA.md#final-public-candidate-native-results). PR #16 remains unmerged and production deployment remains unauthorized.

A read-only baseline check found an external main rebuild that predates this review: existing Worker `piepe`, version `d83207f4-4f22-4c5f-8315-0b6097693fe8`, source `17bbb92af34fa610b4f28b825d59d1d2308a2b53` (**2.5.2**). The successful Cloudflare build log contains that active version ID. No candidate deployment was performed. Current direct live HTTP requests return 403; no current live-browser verification or security-setting change is claimed.
