/* global window, document, HTMLVideoElement, MutationObserver, getComputedStyle */
import {chromium} from 'playwright'
import {resolve} from 'node:path'
import {mkdir,writeFile,rm} from 'node:fs/promises'
import {spawnSync} from 'node:child_process'
const label=process.env.CAPTURE_LABEL||'current',url=process.env.TEST_URL||'http://127.0.0.1:4173'
const sizes=JSON.parse(process.env.CAPTURE_SIZES||'[[1440,900],[1512,982],[2560,1080],[390,844],[390,664]]')
const browser=await chromium.launch({...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {}),...(process.env.PIEPE_BROWSER_PROXY ? {proxy:{server:process.env.PIEPE_BROWSER_PROXY}} : {}),...(process.env.PIEPE_BROWSER_ARGS ? {args:JSON.parse(process.env.PIEPE_BROWSER_ARGS)} : {})})
try{for(const [width,height] of sizes){
 const out=resolve(process.env.PIEPE_REVIEW_DIR||'review-results/seams',label,`${width}x${height}`);await mkdir(out+'/frames',{recursive:true})
 const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message))
 await page.addInitScript(()=>{
  window.seamEvents=[];window.seamGeometry=[];const watched=new WeakSet()
  const event=(type,v)=>window.seamEvents.push({type,at:performance.now(),wall:Date.now(),src:v?.currentSrc,time:v?.currentTime,ready:v?.readyState,dialog:!!document.querySelector('dialog[open]'),phase:document.querySelector('.world')?.getAttribute('data-awakening')})
  for(const name of ['loadeddata','playing','ended','error'])document.addEventListener(name,e=>{if(e.target instanceof HTMLVideoElement)event(name,e.target)},true)
  new MutationObserver(()=>document.querySelectorAll('video').forEach(v=>{if(watched.has(v))return;watched.add(v);v.requestVideoFrameCallback?.(()=>event('decoded',v))})).observe(document,{childList:true,subtree:true})
  document.addEventListener('pointerdown',e=>{event('click');const dot=document.createElement('i');dot.style=`position:fixed;left:${e.clientX-9}px;top:${e.clientY-9}px;width:18px;height:18px;border:2px solid #f2d7a2;border-radius:50%;z-index:999999;pointer-events:none`;document.body.append(dot);setTimeout(()=>dot.remove(),350)},true)
 })
 await page.goto(url+'/en/',{waitUntil:'domcontentloaded'});await page.locator('.world[data-intro-state]').waitFor()
 const cdp=await context.newCDPSession(page),frames=[];let writes=Promise.resolve(),capturing=true
 cdp.on('Page.screencastFrame',e=>{if(!capturing){void cdp.send('Page.screencastFrameAck',{sessionId:e.sessionId}).catch(()=>{});return}const n=frames.length;frames.push({file:`frames/${String(n).padStart(6,'0')}.jpg`,time:e.metadata.timestamp});writes=writes.then(()=>writeFile(out+'/'+frames[n].file,Buffer.from(e.data,'base64')));void cdp.send('Page.screencastFrameAck',{sessionId:e.sessionId}).catch(()=>{})})
 await cdp.send('Page.startScreencast',{format:'jpeg',quality:90,maxWidth:width,maxHeight:height,everyNthFrame:1})
 const shot=async name=>{const at=await page.evaluate(()=>performance.now());await page.screenshot({path:out+'/'+name+'.png'});const geometry=await page.evaluate(()=>Object.fromEntries(['.base-camera','.base-camera .media-plane','.awakening-plane','video[src$="awakening.mp4"]','.specimen-photo','dialog[open]'].map(s=>{const e=document.querySelector(s),r=e?.getBoundingClientRect();return [s,r?{x:r.x,y:r.y,width:r.width,height:r.height,opacity:getComputedStyle(e).opacity,transform:getComputedStyle(e).transform}:null]})));await writeFile(out+'/'+name+'.json',JSON.stringify({at,geometry},null,2))}
 await page.waitForFunction(()=>{const v=document.querySelector('video.forest-film');return v&&v.currentTime>5.8},null,{timeout:16000});await shot('intro-minus200')
 await page.waitForFunction(()=>document.querySelector('.world').getAttribute('data-exit-reason')==='ended');await shot('intro-end');await page.waitForTimeout(750)
 await page.getByRole('button',{name:'Look closer at the fungus',exact:true}).hover();await shot('click-minus200');await page.waitForTimeout(200)
 const clicked=performance.now();await page.getByRole('button',{name:'Look closer at the fungus',exact:true}).click()
 for(const t of [0,100,250,500,1000]){await page.waitForTimeout(Math.max(0,t-(performance.now()-clicked)));await shot('click-plus'+t)}
 await page.waitForFunction(()=>{const v=document.querySelector('video[src$="awakening.mp4"]');return v&&v.currentTime>5.8},null,{timeout:14000});await shot('awakening-minus200')
 await page.waitForFunction(()=>window.seamEvents.some(e=>e.type==='ended'&&e.src?.endsWith('awakening.mp4')))
 const ended=performance.now();for(const t of [0,100,250,500,1000,1600]){await page.waitForTimeout(Math.max(0,t-(performance.now()-ended)));await shot('awakening-plus'+t)}
 await page.getByRole('heading',{name:/A small shelf/}).waitFor({state:'visible',timeout:5000})
 capturing=false;await cdp.send('Page.stopScreencast');await writes
 frames.sort((a,b)=>a.time-b.time)
 const events=await page.evaluate(()=>window.seamEvents)
 await writeFile(out+'/events.json',JSON.stringify({errors,events},null,2))
 await writeFile(out+'/frame-times.json',JSON.stringify({frames,origin:await page.evaluate(()=>performance.timeOrigin)},null,2))
 await page.close()
 const timeline=frames.map((f,i)=>`file '${f.file}'\noption framerate 1000\nduration ${Math.max(.001,(frames[i+1]?.time||f.time+.08)-f.time)}`).join('\n')+`\nfile '${frames.at(-1).file}'\noption framerate 1000\n`;await writeFile(out+'/frames.txt',timeline)
 const encoded=spawnSync('ffmpeg',['-v','error','-y','-f','concat','-safe','0','-i',out+'/frames.txt','-vf','fps=30','-c:v','libx264','-threads','2','-preset','fast','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',out+'/transition.mp4'],{stdio:'inherit'});if(encoded.status!==0)throw Error('Encoding failed')
 for(const [seam,event] of [['click',events.find(e=>e.type==='click')],['awakening',events.find(e=>e.type==='ended'&&e.src?.endsWith('awakening.mp4'))],['intro',events.find(e=>e.type==='ended'&&e.src?.endsWith('reveal.mp4'))]]){
   if(!event)continue
   for(const offset of [-200,0,100,250,500,1000]){
    const time=Math.max(0,event.wall/1000-frames[0].time+offset/1000)
    spawnSync('ffmpeg',['-v','error','-y','-ss',String(time),'-i',out+'/transition.mp4','-frames:v','1',out+`/exact-${seam}-${offset}.png`])
   }
 }
 await rm(out+'/frames',{recursive:true,maxRetries:5,retryDelay:100});await rm(out+'/frames.txt');await context.close();console.log(label,width,height,'recorded')
}}finally{await browser.close()}
