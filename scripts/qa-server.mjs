// Local QA only: fault injection never enters the Vite production bundle.
import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { resolve, extname } from 'node:path'
const root = resolve('dist')
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff' }
const instrumentation = `<script>
const scenario = new URLSearchParams(location.search).get('qa') || 'natural';
if(scenario !== 'return') sessionStorage.removeItem('piepe-entered');
if(scenario === 'blocked') HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('Blocked by QA','NotAllowedError'));

if(scenario === 'save-data') Object.defineProperty(navigator,'connection',{value:{saveData:true},configurable:true});
if(scenario === 'reduced') { const actual=window.matchMedia.bind(window); window.matchMedia=q=>q.includes('prefers-reduced-motion')?{matches:true,media:q,addEventListener(){},removeEventListener(){}}:actual(q); }
const result={scenario,errors:[],requests:[],cls:0,lcp:0};
addEventListener('error',e=>{if(e.message)result.errors.push(e.message)});
try{new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)result.cls+=e.value}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(list=>{result.lcp=list.getEntries().at(-1).startTime}).observe({type:'largest-contentful-paint',buffered:true})}catch{}
document.addEventListener('loadedmetadata',e=>{if(e.target.tagName==='VIDEO')result.metadata={duration:e.target.duration,width:e.target.videoWidth,height:e.target.videoHeight}},true);
document.addEventListener('timeupdate',e=>{if(e.target.tagName==='VIDEO'){result.lastTime=e.target.currentTime;if(scenario==='stall'&&e.target.currentTime>.4)e.target.pause()}},true);
document.addEventListener('ended',e=>{if(e.target.tagName!=='VIDEO')return;try{const c=document.createElement('canvas');c.width=192;c.height=108;const ctx=c.getContext('2d');ctx.drawImage(e.target,0,0,192,108);const a=ctx.getImageData(0,0,192,108).data;ctx.drawImage(document.querySelector('.forest-still'),0,0,192,108);const b=ctx.getImageData(0,0,192,108).data;let diff=0;for(let i=0;i<a.length;i++)if(i%4!==3)diff+=Math.abs(a[i]-b[i]);result.endFrameMeanDifference=diff/(192*108*3)}catch(e){result.frameError=e.message}},true);
addEventListener('DOMContentLoaded',()=>{const out=document.createElement('output');out.id='qa-output';out.style='position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#000e;color:#eee;font:10px monospace;max-height:110px;overflow:auto;padding:8px;pointer-events:none';document.body.append(out);setInterval(()=>{result.reason=document.querySelector('.world')?.dataset.exitReason;result.videoCount=document.querySelectorAll('video').length;result.overflow=document.documentElement.scrollWidth>innerWidth;result.requests=performance.getEntriesByType('resource').filter(e=>/mp4$/.test(e.name)).map(e=>({name:e.name,duration:e.duration,bytes:e.transferSize}));out.textContent=JSON.stringify(result)},200)});
</script>`
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const scenario = url.searchParams.get('qa')
  if (scenario) res.setHeader('Set-Cookie', `piepe-qa=${scenario}; Path=/; SameSite=Lax`)
  const currentScenario = scenario || /piepe-qa=([^;]+)/.exec(req.headers.cookie || '')?.[1]
  const target = resolve(root, '.' + decodeURIComponent(url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname))
  if (!target.startsWith(root + '/')) { res.writeHead(403).end(); return }
  if (currentScenario === 'pending' && target.endsWith('.mp4')) return
  if ((currentScenario === 'missing-video' && target.endsWith('.mp4')) || (currentScenario === 'missing-still' && target.endsWith('forest-final.jpg'))) { res.writeHead(404).end(); return }
  try {
    let data = await readFile(target)
    if (target.endsWith('index.html') && scenario) data = Buffer.from(data.toString().replace('<head>', '<head>' + instrumentation))
    res.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'Content-Length': data.length })
    res.end(data)
  } catch { res.writeHead(404).end() }
}).listen(Number(process.env.PORT || 4174), '127.0.0.1', () => console.log('Local QA harness ready'))
