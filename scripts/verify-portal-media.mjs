import {createHash} from 'node:crypto'
import {readFile} from 'node:fs/promises'

// Build-time only: fail the inexpensive CI build on absent/altered portal assets.
// The media audit separately establishes exact H.264/AAC stream-copy identity.
const sources=JSON.parse(await readFile('docs/qa/v300/sources.json','utf8'))
const derivatives=JSON.parse(await readFile('docs/qa/v300/derivatives.json','utf8'))
const expected=[...sources,...derivatives.flatMap(file=>[
 {path:file.derivative,bytes:file.bytes,sha256:file.derivativeSha256},
 {path:file.poster,sha256:file.posterSha256},
])]
for(const file of expected){
 const bytes=await readFile(file.path)
 if((file.bytes!==undefined&&bytes.length!==file.bytes)||createHash('sha256').update(bytes).digest('hex')!==file.sha256)throw Error(`Portal asset differs from reviewed inventory: ${file.path}`)
}
// The six masters live in source/portal: audited, never published. Only the stream-copied
// faststart derivatives and their native first frames are served. The quiet world uses sized
// copies of portal-05-first.webp (scripts/image-derivatives.mjs) with that frame as its fallback.
console.log(`Verified ${expected.length} original/source-quality portal assets`)
