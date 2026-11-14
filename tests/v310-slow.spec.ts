import {test,expect} from '@playwright/test'
import {createServer} from 'node:http'
import {readFile} from 'node:fs/promises'
import type {AddressInfo} from 'node:net'
import worker from '../src/worker'
import {nativeDiagnostics} from './nativeDiagnostics'
nativeDiagnostics()

// Immutable first AVC packet: ffprobe pos=8335,size=471359. Never replace the film
// with synthetic pixels or dispatch fabricated browser media/progress events.
for(const mode of ['progress','stall'] as const)test(`3.1 source-quality ${mode}: native download beyond 20s or bounded stall with real retry`,async({page,baseURL,browserName})=>{
 test.setTimeout(65000)
 const bytes=await readFile('public/media/portal-02-faststart.mp4'),sent:{at:number;bytes:number}[]=[],timers=new Set<ReturnType<typeof setInterval>>()
 let recovered=false,downloadBegan=0,testBegan=0
 const requests:{range:string|null;status:number;contentRange:string|null;bytes:number}[]=[]
 const server=createServer(async(req,res)=>{
  if(req.url?.split('?')[0]==='/media/portal-02-faststart.mp4'){
   // Safari probes bytes=0-1 before requesting the actual media. Use the real
   // Worker to honor exact ranges; the fixture throttles transport, not parsing.
   const range=req.headers.range??null,headers=new Headers(range?{Range:range}:{})
   const response=await worker.fetch(new Request('http://fixture/media/portal-02-faststart.mp4',{method:req.method,headers}),{ASSETS:{fetch:async()=>new Response(bytes,{headers:{'Content-Type':'video/mp4','Content-Length':String(bytes.length)}})}})
   const body=Buffer.from(await response.arrayBuffer()),contentRange=response.headers.get('Content-Range'),start=Number(/^bytes (\d+)-/.exec(contentRange||'')?.[1]||0)
   requests.push({range,status:response.status,contentRange,bytes:body.length});res.writeHead(response.status,Object.fromEntries(response.headers))
   if(recovered||response.status===416||body.length<=2||start+body.length<=8335||start>=479694){res.end(body);return}
   downloadBegan||=Date.now();let offset=Math.min(body.length,Math.max(0,8335-start));res.write(body.subarray(0,offset));sent.push({at:Date.now()-downloadBegan,bytes:start+offset})
   if(mode==='stall')return
   const timer=setInterval(()=>{
    const elapsed=Date.now()-downloadBegan,allowed=elapsed>=28000?bytes.length:8335+Math.floor(471358*elapsed/28000)
    const next=Math.max(offset,Math.min(body.length,allowed-start));if(next>offset){res.write(body.subarray(offset,next));offset=next;sent.push({at:elapsed,bytes:start+offset})}
    if(offset===body.length){clearInterval(timer);timers.delete(timer);res.end()}
   },350);timers.add(timer);res.once('close',()=>{clearInterval(timer);timers.delete(timer)});return
  }
  try{const response=await fetch(new URL(req.url!,baseURL),{redirect:'manual',headers:req.headers.range?{Range:req.headers.range}:undefined});const body=Buffer.from(await response.arrayBuffer());res.writeHead(response.status,{...Object.fromEntries([...response.headers].filter(([key])=>!['content-length','content-encoding','transfer-encoding','connection'].includes(key))),'Content-Length':String(body.length)});res.end(body)}catch{res.writeHead(502);res.end()}
 })
 await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve))
 try{
  const origin=`http://127.0.0.1:${(server.address() as AddressInfo).port}`
  const probe=await fetch(origin+'/media/portal-02-faststart.mp4',{headers:{Range:'bytes=0-1'}});expect(probe.status).toBe(206);expect(probe.headers.get('Content-Range')).toBe(`bytes 0-1/${bytes.length}`);expect(Buffer.from(await probe.arrayBuffer())).toEqual(bytes.subarray(0,2));expect(downloadBegan).toBe(0)
  if(mode==='progress'&&browserName==='chromium')await page.addInitScript(()=>{
   // Reproduce the measured AVFoundation signal ordering with real source bytes:
   // metadata reports enough data before any picture, and native progress does
   // not describe pre-sample transport. Never synthesize a frame or media time.
   document.addEventListener('progress',event=>{
    const v=event.target;if(!(v instanceof HTMLVideoElement)||!v.currentSrc.includes('portal-02-faststart'))return
    if(v.dataset.earlyReadiness!=='true'){
     // Chrome delays metadata until a sample; AVFoundation publishes the same
     // immutable1920x1080 metadata while that sample is still downloading.
     for(const [name,value]of Object.entries({readyState:4,videoWidth:1920,videoHeight:1080}))Object.defineProperty(v,name,{configurable:true,get:()=>value})
     v.dataset.earlyReadiness='true'
     v.addEventListener('loadedmetadata',()=>{for(const name of ['readyState','videoWidth','videoHeight'])delete(v as unknown as Record<string,unknown>)[name]},{once:true})
     v.dispatchEvent(new Event('loadeddata'))
    }
    if(v.getVideoPlaybackQuality().totalVideoFrames===0)event.stopImmediatePropagation()
   },true)
  })
  await page.addInitScript(()=>{sessionStorage.setItem('piepe-entered','1');localStorage.setItem('piepe-forest-sound','off')});await page.goto(`http://127.0.0.1:${(server.address() as AddressInfo).port}/en/#encounter`);await page.locator('[data-portal-entry]').click();const portal=page.locator('.fungus-portal');await expect(portal).toHaveAttribute('data-portal-still-presented','true');const began=Date.now();testBegan=began;await portal.getByRole('button',{name:'Begin journey',exact:true}).click()
  await expect(portal.getByRole('status')).toContainText('original-quality film is still loading',{timeout:11000});await expect(portal.getByRole('button',{name:'Try again',exact:true})).toBeVisible();await expect(portal.getByRole('button',{name:'Exit',exact:true})).toBeVisible()
  if(mode==='progress'){
   await page.waitForTimeout(Math.max(0,21000-(Date.now()-began)));await expect(portal).not.toHaveAttribute('data-portal-phase','error');expect(sent.at(-1)!.bytes).toBeGreaterThan(200000);if(browserName==='chromium')await expect(portal.locator('[data-portal-clip="0"] video')).toHaveAttribute('data-early-readiness','true')
   // Entering is narrative state; Safari may report it before real frames.
   // Assert motion only after the fixture has delivered the complete first packet.
   await expect.poll(()=>sent.some(chunk=>chunk.bytes>=479694),{timeout:15000}).toBe(true)
   await expect(portal).toHaveAttribute('data-portal-phase','entering',{timeout:15000});expect(Date.now()-began).toBeGreaterThan(20000)
  }else{
   await expect(portal).toHaveAttribute('data-portal-phase','error',{timeout:16000});expect(Date.now()-began).toBeLessThan(25000);recovered=true;await portal.getByRole('button',{name:'Try again',exact:true}).click();await expect(portal).toHaveAttribute('data-portal-phase','entering')
  }
  // Slow-start observation is one capped range of the same original source,
  // rather than another full download. A header-only stall must still fail <25s.
  const observations=requests.filter(request=>request.range==='bytes=16384-540671');expect(observations.length).toBeLessThanOrEqual(1);for(const request of observations){expect(request.status).toBe(206);expect(request.contentRange).toBe(`bytes 16384-540671/${bytes.length}`);expect(request.bytes).toBe(524288)}
  if(mode==='progress'&&browserName==='chromium')expect(observations).toHaveLength(1)
  const video=portal.locator('[data-portal-clip="0"] video[src]');await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThan(.3);expect(await video.evaluate((v:HTMLVideoElement)=>({width:v.videoWidth,height:v.videoHeight,rate:v.playbackRate}))).toEqual({width:1920,height:1080,rate:1});await page.keyboard.press('Escape');await expect(portal).toHaveCount(0)
 }finally{
  const media=page.isClosed()?null:await page.evaluate(()=>({focus:document.hasFocus(),visibility:document.visibilityState,phase:document.querySelector('.fungus-portal')?.getAttribute('data-portal-phase'),videos:[...document.querySelectorAll('video[src]')].map(v=>({src:v.currentSrc,time:v.currentTime,paused:v.paused,muted:v.muted,ready:v.readyState,network:v.networkState,error:v.error?{code:v.error.code,message:v.error.message}:null,buffered:Array.from({length:v.buffered.length},(_,i)=>[v.buffered.start(i),v.buffered.end(i)])}))}))
  await test.info().attach(`native-${mode}-network`,{body:JSON.stringify({mode,elapsedMs:testBegan?Date.now()-testBegan:0,requests,sent,media},null,2),contentType:'application/json'})
  for(const timer of timers)clearInterval(timer);server.closeAllConnections();await new Promise<void>(resolve=>server.close(()=>resolve()))
 }
})
