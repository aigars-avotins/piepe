// Browser QA uses the real media Worker; Vite preview does not implement its byte ranges.
import http from 'node:http'
import {createReadStream} from 'node:fs'
import {stat} from 'node:fs/promises'
import {Readable} from 'node:stream'
import {pipeline} from 'node:stream/promises'
import {resolve,extname} from 'node:path'
import worker from '../src/worker.ts'
const root=resolve('dist')
const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.jpg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.txt':'text/plain'}
const assets={async fetch(request){
 const url=new URL(request.url);const path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname))
 if(!path.startsWith(root+'/'))return new Response(null,{status:404})
 try{const info=await stat(path);if(!info.isFile())return new Response(null,{status:404});return new Response(request.method==='HEAD'?null:Readable.toWeb(createReadStream(path)),{headers:{'Content-Type':types[extname(path)]||'application/octet-stream','Content-Length':String(info.size),'Cache-Control':'no-store','ETag':`"${info.size}-${info.mtimeMs}"`}})}catch{return new Response(null,{status:404})}
}}
http.createServer(async(req,res)=>{
 const headers=new Headers();for(const [key,value] of Object.entries(req.headers))if(value)headers.set(key,Array.isArray(value)?value.join(','):value)
 const request=new Request('http://127.0.0.1:4173'+req.url,{method:req.method,headers})
 const response=new URL(request.url).pathname.startsWith('/media/')?await worker.fetch(request,{ASSETS:assets}):await assets.fetch(request)
 res.writeHead(response.status,Object.fromEntries(response.headers));if(response.body)await pipeline(Readable.fromWeb(response.body),res).catch(()=>{});else res.end()
}).listen(4173,'127.0.0.1',()=>console.log('Forest QA server with production media Worker ready'))
