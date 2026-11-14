// Browser QA uses the real media Worker; Vite preview does not implement its byte ranges.
import http from 'node:http'
import {createReadStream} from 'node:fs'
import {stat,readFile} from 'node:fs/promises'
import {Readable} from 'node:stream'
import {pipeline} from 'node:stream/promises'
import {resolve,extname} from 'node:path'
import worker from '../src/worker.ts'
const root=resolve('dist')
// Apply the actual built static-asset policies in browser QA, including exact
// download-only disposition rules. The production Worker/config are unchanged.
const rules=[]
for(const line of (await readFile(resolve(root,'_headers'),'utf8')).split(/\r?\n/)){
 if(!line.trim())continue
 if(!/^\s/.test(line)){
  const escape=part=>part.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')
  rules.push({path:new RegExp('^'+line.trim().split('*').map(escape).join('.*')+'$'),headers:[]})
 }else{const colon=line.indexOf(':');if(colon>0)rules.at(-1).headers.push([line.slice(0,colon).trim(),line.slice(colon+1).trim()])}
}
const assetHeaders=(path,values={})=>{const headers=new Headers(values);for(const rule of rules)if(rule.path.test(path))for(const[name,value]of rule.headers)headers.set(name,value);return headers}
const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.jpg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.txt':'text/plain; charset=utf-8','.ico':'image/x-icon','.png':'image/png','.xml':'application/xml','.webmanifest':'application/manifest+json'}
const assets={async fetch(request){
 const url=new URL(request.url);const path=resolve(root,'.'+decodeURIComponent(url.pathname.endsWith('/')?url.pathname+'index.html':url.pathname))
 if(!path.startsWith(root+'/'))return new Response(null,{status:404,headers:assetHeaders(url.pathname)})
 try{const info=await stat(path);if(!info.isFile())return new Response(null,{status:404,headers:assetHeaders(url.pathname)});return new Response(request.method==='HEAD'?null:Readable.toWeb(createReadStream(path)),{headers:assetHeaders(url.pathname,{'Content-Type':types[extname(path)]||'application/octet-stream','Content-Length':String(info.size),'Cache-Control':'no-store','ETag':`"${info.size}-${info.mtimeMs}"`})})}catch{return new Response(null,{status:404,headers:assetHeaders(url.pathname)})}
}}
http.createServer(async(req,res)=>{
 const headers=new Headers();for(const [key,value] of Object.entries(req.headers))if(value)headers.set(key,Array.isArray(value)?value.join(','):value)
 const request=new Request('http://127.0.0.1:4173'+req.url,{method:req.method,headers})
 const response=new URL(request.url).pathname.startsWith('/media/')?await worker.fetch(request,{ASSETS:assets}):await assets.fetch(request)
 res.writeHead(response.status,Object.fromEntries(response.headers));if(response.body)await pipeline(Readable.fromWeb(response.body),res).catch(()=>{});else res.end()
}).listen(4173,'127.0.0.1',()=>console.log('Forest QA server with production media Worker ready'))
