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
const still=await readFile('public/media/portal-living-still.webp')
if(!still.equals(await readFile('public/media/portal-05-first.webp')))throw Error('Quiet world must retain the reviewed native first frame')
console.log(`Verified ${expected.length+1} original/source-quality portal assets`)
