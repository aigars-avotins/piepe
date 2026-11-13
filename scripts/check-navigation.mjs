import {readFile} from 'node:fs/promises'
import {linkPolicy} from '../src/linkPolicy.ts'

const decode = value => value.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>')
const sitemap=await readFile('dist/sitemap.xml','utf8'),paths=[...sitemap.matchAll(/<loc>https:\/\/pie\.pe([^<]+)<\/loc>/g)].map(match=>match[1])
if(paths.length!==20)throw Error('Expected all 20 original canonical documents')
let anchors=0
for(const path of paths){
 const html=await readFile('dist'+(path==='/'?'/index.html':path+'index.html'),'utf8')
 if(/<base\b/i.test(html))throw Error(`Unexpected navigation base in ${path}`)
 for(const match of html.matchAll(/<a\b([^>]*)>/g)){
  const attrs=Object.fromEntries([...match[1].matchAll(/(?:^|\s)([\w-]+)(?:="([^"]*)")?/g)].map(item=>[item[1],decode(item[2]||'')]))
  if(!attrs.href)throw Error(`Missing native link href in ${path}`)
  const expected=linkPolicy(attrs.href)
  if(expected.target==='_blank'){
   const rel=new Set((attrs.rel||'').split(/\s+/))
   if(attrs.target!=='_blank'||!rel.has('noopener')||!rel.has('noreferrer'))throw Error(`Unsafe external navigation in ${path}: ${attrs.href}`)
  }else if(attrs.target&&attrs.target!=='_self')throw Error(`Internal/native action opens another tab in ${path}: ${attrs.href}`)
  if('download'in attrs&&new URL(attrs.href,'https://pie.pe').hostname==='pie.pe'&&attrs.target)throw Error(`Download target in ${path}`)
  anchors++
 }
}
console.log(`Verified native navigation policy for ${anchors} anchors across ${paths.length} prerendered routes`)
