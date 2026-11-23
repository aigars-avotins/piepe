import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { expect } from '@playwright/test'

// Historical baselines (2.5.7 … 3.2) stay exactly as they were written. This ledger is the one
// place that records what 3.3 intentionally changed, moved or retired; everything else must still
// match its original hash. Refresh "changed" with: node scripts/pin-reviewed-sources.mjs
type Ledger = { changed: Record<string, string>; moved: Record<string, string>; retired: string[] }
export const digest = (bytes: Buffer | string) => createHash('sha256').update(bytes).digest('hex')
export const reviewedLedger = async (): Promise<Ledger> => JSON.parse(await readFile('docs/qa/v330/reviewed-sources.json', 'utf8'))

/** Every listed file keeps its baseline bytes unless the 3.3 ledger names it. A moved file must keep its hash. */
export async function expectPreserved(expected: Record<string, string>, root = '') {
  const ledger = await reviewedLedger()
  for (const [name, hash] of Object.entries(expected)) {
    const path = root + name
    if (ledger.retired.includes(path)) continue
    expect(digest(await readFile(ledger.moved[path] ?? path)), path).toBe(ledger.changed[path] ?? hash)
  }
}
/** The site-wide block of public/_headers, before the per-download rules. */
export async function expectHeaderPrefix(hash: string) {
  const ledger = await reviewedLedger(), text = (await readFile('public/_headers', 'utf8')).split('/wallpapers/piepe-forest-desktop-5120x2880.jpg')[0]
  expect(digest(text), 'public/_headers#site').toBe(ledger.changed['public/_headers#site'] ?? hash)
}
