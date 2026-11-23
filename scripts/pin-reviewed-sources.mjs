// Re-pin the files 3.3 intentionally changed: node scripts/pin-reviewed-sources.mjs [path ...]
// Extra paths are added to the ledger. Run only after reviewing the diff of each listed file.
import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
const file = 'docs/qa/v330/reviewed-sources.json', ledger = JSON.parse(await readFile(file, 'utf8'))
const digest = value => createHash('sha256').update(value).digest('hex')
for (const path of [...Object.keys(ledger.changed), ...process.argv.slice(2)]) {
  ledger.changed[path] = path === 'public/_headers#site'
    ? digest((await readFile('public/_headers', 'utf8')).split('/wallpapers/piepe-forest-desktop-5120x2880.jpg')[0])
    : digest(await readFile(path))
}
ledger.changed = Object.fromEntries(Object.entries(ledger.changed).sort(([a], [b]) => a.localeCompare(b)))
await writeFile(file, JSON.stringify(ledger, null, 2) + '\n')
console.log(`Pinned ${Object.keys(ledger.changed).length} reviewed sources`)
