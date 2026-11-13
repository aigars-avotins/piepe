import {test,expect} from '@playwright/test'
import {createServer} from 'node:http'
import {readFile} from 'node:fs/promises'
import type {AddressInfo} from 'node:net'

// Immutable first AVC packet: ffprobe pos=8335,size=471359. Never replace the film
// with synthetic pixels or dispatch fabricated browser media/progress events.
for(const mode of ['progress','stall'] as const)test(`3.1 source-quality ${mode}: native download beyond 20s or bounded stall with real retry`,async({page,baseURL})=>{
 test.setTimeout(65000)
 const bytes=await readFile('public/media/portal-02-faststart.mp4'),sent:{at:number;bytes:number}[]=[],timers=new Set<ReturnType<typeof setInterval>>()
 let recovered=false
 const server=createServer(async(req,res)=>{
  if(req.url?.split('?')[0]==='/media/portal-02-faststart.mp4'&&!recovered){
   const start=Number(/bytes=(\d+)-/.exec(req.headers.range||'')?.[1]||0),began=Date.now()
   res.writeHead(req.headers.range?206:200,{'Content-Type':'video/mp4','Content-Length':bytes.length-start,'Accept-Ranges':'bytes',...(req.headers.range?{'Content-Range':`bytes ${start}-${bytes.length-1}/${bytes.length}`}:{})})
   if(start>0){res.end(bytes.subarray(start));return}
   let offset=8335;res.write(bytes.subarray(0,offset));sent.push({at:0,bytes:offset})
   if(mode==='stall')return
   const timer=setInterval(()=>{
    const next=Math.min(8335+471358,offset+Math.ceil(471358/80));res.write(bytes.subarray(offset,next));offset=next;sent.push({at:Date.now()-began,bytes:offset})
    if(Date.now()-began>=28000){clearInterval(timer);timers.delete(timer);res.end(bytes.subarray(offset))}
   },350);timers.add(timer);res.once('close',()=>{clearInterval(timer);timers.delete(timer)});return
  }
  try{const response=await fetch(new URL(req.url!,baseURL),{redirect:'manual'});res.writeHead(response.status,Object.fromEntries([...response.headers].filter(([key])=>!['content-length','content-encoding','transfer-encoding','connection'].includes(key))));res.end(Buffer.from(await response.arrayBuffer()))}catch{res.writeHead(502);res.end()}
 })
 await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve))
 try{
  await page.addInitScript(()=>{sessionStorage.setItem('piepe-entered','1');localStorage.setItem('piepe-forest-sound','off')});await page.goto(`http://127.0.0.1:${(server.address() as AddressInfo).port}/en/#encounter`);await page.locator('[data-portal-entry]').click();const portal=page.locator('.fungus-portal');await expect(portal).toHaveAttribute('data-portal-still-presented','true');const began=Date.now();await portal.getByRole('button',{name:'Begin journey',exact:true}).click()
  await expect(portal.getByRole('status')).toContainText('original-quality film is still loading',{timeout:11000});await expect(portal.getByRole('button',{name:'Try again',exact:true})).toBeVisible();await expect(portal.getByRole('button',{name:'Exit',exact:true})).toBeVisible()
  if(mode==='progress'){
   await page.waitForTimeout(Math.max(0,21000-(Date.now()-began)));await expect(portal).not.toHaveAttribute('data-portal-phase','error');expect(sent.at(-1)!.bytes).toBeGreaterThan(200000)
   await expect(portal).toHaveAttribute('data-portal-phase','entering',{timeout:15000});expect(Date.now()-began).toBeGreaterThan(20000)
  }else{
   await expect(portal).toHaveAttribute('data-portal-phase','error',{timeout:16000});expect(Date.now()-began).toBeLessThan(25000);recovered=true;await portal.getByRole('button',{name:'Try again',exact:true}).click();await expect(portal).toHaveAttribute('data-portal-phase','entering')
  }
  const video=portal.locator('[data-portal-clip="0"] video[src]');await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThan(.3);expect(await video.evaluate((v:HTMLVideoElement)=>({width:v.videoWidth,height:v.videoHeight,rate:v.playbackRate}))).toEqual({width:1920,height:1080,rate:1});await page.keyboard.press('Escape');await expect(portal).toHaveCount(0)
  await test.info().attach(`native-${mode}-network`,{body:JSON.stringify({mode,elapsedMs:Date.now()-began,sent},null,2),contentType:'application/json'})
 }finally{for(const timer of timers)clearInterval(timer);server.closeAllConnections();await new Promise<void>(resolve=>server.close(()=>resolve()))}
})
