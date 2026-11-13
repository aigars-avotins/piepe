import {readFile,writeFile} from 'node:fs/promises'
import {execFile} from 'node:child_process'
import {promisify} from 'node:util'
import {pathToFileURL} from 'node:url'
const run=promisify(execFile),redirects=new Set([301,302,303,307,308])
const headLinks=html=>[...html.matchAll(/<link\b([^>]*)>/gi)].map(match=>Object.fromEntries([...match[1].matchAll(/(?:^|\s)([\w-]+)="([^"]*)"/g)].map(attribute=>[attribute[1].toLowerCase(),attribute[2].replace(/&amp;/g,'&')])))

export function redirectTarget(current,location,seen,allowedOrigins){
 if(!location||/[\r\n]/.test(location))throw Error('Empty or malformed Location')
 let next
 try{next=new URL(location,current);next.hash=''}catch{throw Error('Malformed Location URL')}
 if(!['http:','https:'].includes(next.protocol)||!allowedOrigins.has(next.origin))throw Error('Unexpected redirect origin')
 if(new URL(current).protocol==='https:'&&next.protocol!=='https:')throw Error('HTTPS downgrade')
 if(seen.has(next.href))throw Error('Redirect loop')
 return next.href
}

async function fetchRaw(url,method){
 const args=['-sS','--max-time','25','-A','Mozilla/5.0','--include',...(method==='HEAD'?['--head']:[]),url]
 const {stdout}=await run('curl',args,{encoding:'utf8',maxBuffer:2*1024*1024})
 let rest=stdout,statusLine='',headers={}
 // Preserve the final response, excluding the managed proxy's CONNECT response.
 while(/^HTTP\//.test(rest)){
  const match=/^(HTTP\/\S+\s+(\d+)[^\r\n]*)\r?\n([\s\S]*?)\r?\n\r?\n/.exec(rest)
  if(!match)throw Error('Malformed HTTP response headers')
  statusLine=match[1];headers={}
  for(const line of match[3].split(/\r?\n/)){const colon=line.indexOf(':');if(colon>0)headers[line.slice(0,colon).toLowerCase()]=line.slice(colon+1).trim()}
  rest=rest.slice(match[0].length)
 }
 if(!statusLine)throw Error('Missing HTTP status')
 return{status:Number(statusLine.split(/\s+/)[1]),statusLine,headers,body:method==='HEAD'?'':rest}
}

export async function auditRedirects(origin='https://pie.pe'){
 const paths=[...(await readFile('public/sitemap.xml','utf8')).matchAll(/<loc>https:\/\/pie\.pe([^<]+)<\/loc>/g)].map(m=>m[1])
 if(paths.length!==20)throw Error('Expected all twenty canonical routes')
 origin=new URL(origin).origin
 const origins=new Set([origin,...(origin==='https://pie.pe'?['http://pie.pe']:[])])
 const cases=paths.map(path=>({kind:'canonical',url:origin+path,status:200,maxHops:0,path}))
 cases.push(...paths.filter(path=>path!=='/').map(path=>({kind:'slash',url:origin+path.slice(0,-1),status:200,maxHops:1})))
 for(const path of ['/index.html','/en/index.html','/kas-ir-piepe/index.html','/en/what-is-a-bracket-fungus/index.html'])cases.push({kind:'index-alias',url:origin+path,status:200,maxHops:1})
 for(const path of ['/?utm_source=v310-audit','/en?utm_source=v310-audit','/kas-ir-piepe?utm_source=v310-audit'])cases.push({kind:'query',url:origin+path,status:200,maxHops:1})
 for(const path of ['/kas%2Dir%2Dpiepe/','/%65n/','/en%2Fwhat-is-a-bracket-fungus/'])cases.push({kind:'encoded',url:origin+path,status:200,maxHops:1})
 for(const path of ['/not-a-page/','/meza-piezimes/007/','/en/field-notes/999/','/en/forest-wallpapers/missing/'])cases.push({kind:'unknown',url:origin+path,status:404,maxHops:0})
 if(origin==='https://pie.pe')for(const path of ['/','/en/'])cases.push({kind:'scheme',url:'http://pie.pe'+path,status:200,maxHops:1})
 const results=[]
 for(const entry of cases)for(const method of ['GET','HEAD']){
  let url=entry.url,response;const seen=new Set([url]),steps=[]
  for(let hop=0;hop<6;hop++){
   response=await fetchRaw(url,method);steps.push({url,status:response.status,statusLine:response.statusLine,location:response.headers.location??null,date:response.headers.date??null,cfRay:response.headers['cf-ray']??null})
   if(!redirects.has(response.status))break
   url=redirectTarget(url,response.headers.location,seen,origins);seen.add(url)
  }
  if(redirects.has(response.status))throw Error(`Overlong chain: ${entry.url}`)
  if(response.status!==entry.status||steps.length-1>entry.maxHops)throw Error(`Unexpected ${response.status}/${steps.length-1} hops: ${method} ${entry.url}`)
  const row={...entry,method,steps,finalUrl:url,finalStatus:response.status,hops:steps.length-1}
  if(method==='GET'&&entry.kind==='canonical'){
   const links=headLinks(response.body),canonical=links.filter(link=>link.rel==='canonical').map(link=>link.href)
   const alternate=links.filter(link=>link.rel==='alternate'&&link.hreflang).map(link=>[link.hreflang,link.href])
   if(canonical.length!==1||canonical[0]!=='https://pie.pe'+entry.path||alternate.length!==3)throw Error(`Wrong canonical/hreflang ${entry.url}`)
   row.canonical=canonical[0];row.hreflang=Object.fromEntries(alternate)
  }
  results.push(row)
 }
 for(let i=0;i<results.length;i+=2){
  const a=results[i],b=results[i+1]
  if(a.finalUrl!==b.finalUrl||a.finalStatus!==b.finalStatus||a.hops!==b.hops)throw Error(`GET/HEAD disagreement: ${a.url}`)
  if(new URL(a.url).search!==new URL(a.finalUrl).search)throw Error(`Redirect discarded query: ${a.url}`)
 }
 const canonicalRows=results.filter(row=>row.kind==='canonical'&&row.method==='GET'),direct=new Set(canonicalRows.map(row=>row.canonical))
 for(const row of canonicalRows){
  if(!Object.values(row.hreflang).every(url=>direct.has(url)))throw Error(`Hreflang points outside direct canonical graph: ${row.url}`)
  const other=canonicalRows.find(item=>item.canonical===row.hreflang[row.path.startsWith('/en/')?'lv':'en'])
  if(!other||!Object.values(other.hreflang).includes(row.canonical))throw Error(`Non-reciprocal hreflang: ${row.url}`)
 }
 return{origin,checkedAtUtc:new Date().toISOString(),canonicalRoutes:paths.length,www:'Not manufactured: public DNS A/CNAME NXDOMAIN in the before audit.',results}
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const value=flag=>process.argv[process.argv.indexOf(flag)+1]
 const report=await auditRedirects(process.argv.includes('--origin')?value('--origin'):undefined)
 if(process.argv.includes('--out'))await writeFile(value('--out'),JSON.stringify(report,null,2)+'\n')
 console.log(`Verified ${report.results.length} real GET/HEAD chains, ${report.canonicalRoutes} direct canonical routes and reciprocal hreflang; no loops or accidental multiple hops`)
}
