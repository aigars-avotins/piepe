/* global window, document, requestAnimationFrame, scrollY, innerHeight, scrollTo, HTMLVideoElement, getComputedStyle */
// Actual Chromium screencast frames with their browser timestamps; no synthetic scene animation.
import { chromium } from 'playwright'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
const target = process.env.TEST_URL || 'http://127.0.0.1:4173'
const out = resolve(process.env.PIEPE_REVIEW_DIR || 'review-results')
const [width,height] = JSON.parse(process.env.JOURNEY_VIEWPORT || '[1440,900]')
await mkdir(out, { recursive: true }); await mkdir(`${out}/frames`, { recursive: true })
const browser = await chromium.launch({ ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {}), ...(process.env.PIEPE_BROWSER_PROXY ? { proxy: { server: process.env.PIEPE_BROWSER_PROXY } } : {}), ...(process.env.PIEPE_BROWSER_ARGS ? { args: JSON.parse(process.env.PIEPE_BROWSER_ARGS) } : {}) })
try {
  const page = await browser.newPage({ viewport: { width, height } })
  const errors = [], frames = []; let writes = Promise.resolve(), capturing = true
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
    window.piepePerf = { cls: 0, lcp: 0, maxPlaying: 0, frameIntervals: [], events: [] }
    const mediaEvent=(type,v)=>window.piepePerf.events.push({type,wall:Date.now(),src:v.currentSrc,ready:v.readyState,time:v.currentTime})
    for(const name of ['loadeddata','playing','ended'])document.addEventListener(name,event=>{if(event.target instanceof HTMLVideoElement){mediaEvent(name,event.target);if(name==='loadeddata')event.target.requestVideoFrameCallback?.(()=>mediaEvent('decoded',event.target))}},true)
    document.addEventListener('pointerdown',event=>{if(!event.target.closest?.('.fungus-hit,.fungus-annotation'))return;window.piepePerf.events.push({type:'click',wall:Date.now()});const dot=document.createElement('i');dot.style=`position:fixed;left:${event.clientX-9}px;top:${event.clientY-9}px;width:18px;height:18px;border:2px solid #f2d7a2;border-radius:50%;z-index:999999;pointer-events:none`;document.body.append(dot);setTimeout(()=>dot.remove(),350)},true)
    try { new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.piepePerf.cls += e.value }).observe({type:'layout-shift', buffered:true}); new PerformanceObserver(list => { window.piepePerf.lcp = list.getEntries().at(-1).startTime }).observe({type:'largest-contentful-paint', buffered:true}) } catch { /* Browser support varies. */ }
    let previous = performance.now(), macro=false; const frame = now => { const layer=document.querySelector('.understory-cinema'),present=layer ? Number(getComputedStyle(layer).opacity)>.01 : !!document.querySelector('[data-clip=understory]');if(present!==macro){window.piepePerf.events.push({type:present?'macro-entry':'macro-exit',wall:Date.now()});macro=present}const visibleFilm = [...document.querySelectorAll('video')].filter(v=>!v.paused&&!v.ended).length; window.piepePerf.maxPlaying=Math.max(window.piepePerf.maxPlaying,visibleFilm); if(visibleFilm)window.piepePerf.frameIntervals.push(now-previous);previous=now;requestAnimationFrame(frame) };requestAnimationFrame(frame)
  })
  await page.goto(target + '/', {waitUntil:'domcontentloaded'}); await page.locator('.world[data-intro-state]').waitFor()
  const cdp = await page.context().newCDPSession(page)
  cdp.on('Page.screencastFrame', event => {
    if (!capturing) { void cdp.send('Page.screencastFrameAck',{sessionId:event.sessionId}).catch(()=>{}); return }
    const index=frames.length; frames.push({ file:`frames/${String(index).padStart(6,'0')}.jpg`, time:event.metadata.timestamp })
    writes=writes.then(()=>writeFile(`${out}/${frames[index].file}`,Buffer.from(event.data,'base64')))
    void cdp.send('Page.screencastFrameAck',{sessionId:event.sessionId}).catch(()=>{})
  })
  await cdp.send('Page.startScreencast',{format:'jpeg',quality:86,maxWidth:width,maxHeight:height,everyNthFrame:1})
  const shots=[]
  const shot = async name => {shots.push({name,...await page.evaluate(()=>({wall:Date.now(),scroll:scrollY,macroOpacity:document.querySelector('.understory-cinema') ? getComputedStyle(document.querySelector('.understory-cinema')).opacity : null}))});await page.screenshot({path:`${out}/${name}.png`,scale:'css'})}
  await page.waitForFunction(()=>document.querySelector('.world')?.getAttribute('data-exit-reason')==='ended',null,{timeout:15000});await page.waitForTimeout(700);await shot('desktop-lv-hero')
  await page.getByRole('button',{name:'Aplūkot piepi tuvāk',exact:true}).click();await page.waitForTimeout(2500);await shot('desktop-awakening')
  await page.getByRole('heading',{name:/Maza piepe/}).waitFor({state:'visible',timeout:10000});await shot('desktop-lv-discovery')
  await page.getByRole('tab',{name:/Virsma/}).press('End');await page.waitForTimeout(600);await page.getByRole('button',{name:'Aizvērt piepes stāstu'}).click();await page.getByRole('dialog').waitFor({state:'hidden'})
  const scroll = async (id,duration=2000) => page.evaluate(async ({id,duration})=>{
    const start=scrollY,end=document.getElementById(id).offsetTop+innerHeight*.05,t=performance.now()
    window.piepePerf.events.push({type:'scroll-start',id,wall:Date.now(),from:start,to:end})
    await new Promise(resolve=>{function frame(now){const p=Math.min(1,(now-t)/duration),e=p*p*(3-2*p);scrollTo({top:start+(end-start)*e,behavior:'instant'});if(p<1)requestAnimationFrame(frame);else resolve()}requestAnimationFrame(frame)})
    window.piepePerf.events.push({type:'scroll-end',id,wall:Date.now(),from:start,to:end})
  },{id,duration})
  await scroll('understory');await page.waitForTimeout(1500);await shot('desktop-macro')
  await page.locator('[data-clip="understory"][data-clip-reason="ended"]').waitFor({timeout:11000})
  await scroll('encounter');await shot('desktop-encounter');await scroll('fungus-facts');await page.waitForTimeout(700);await shot('desktop-facts')
  await scroll('return');await page.waitForTimeout(1800);await shot('desktop-breathing');await page.locator('[data-clip="breathing"][data-clip-state="complete"]').waitFor({timeout:11000})
  await scroll('wallpapers');await page.waitForTimeout(700);await shot('desktop-wallpapers')
  for(const id of ['return','encounter','understory','forest']){await scroll(id);await page.waitForTimeout(400);await shot('desktop-reverse-'+id)}
  capturing=false;await cdp.send('Page.stopScreencast');await writes
  // CDP can finish encoding frames out of order. Reconstruct capture time, not delivery order.
  frames.sort((a,b)=>a.time-b.time)
  const perf=await page.evaluate(()=>{const p=window.piepePerf;const sorted=p.frameIntervals.toSorted((a,b)=>a-b);return {...p,frameIntervals:undefined,frameIntervalP95:sorted[Math.floor(sorted.length*.95)],jsHeapUsed:performance.memory?.usedJSHeapSize,fingerprint:{version:document.querySelector('.world').dataset.version,module:new URL(document.querySelector('head script[type=module]').src).pathname},resources:performance.getEntriesByType('resource').filter(r=>/\.mp[34]$|wallpapers/.test(r.name)).map(r=>({url:r.name,bytes:r.transferSize}))}})
  await writeFile(`${out}/performance.json`,JSON.stringify({environment:`Linux Chromium ${width}x${height} emulation during screencast; lab observations`,errors,...perf},null,2))
  await writeFile(`${out}/frame-times.json`,JSON.stringify({frames,shots},null,2))
  await writeFile(`${out}/events.json`,JSON.stringify({errors,events:perf.events},null,2))
  if(errors.length)throw Error(JSON.stringify(errors))
  await page.close()
  const timeline=frames.map((f,i)=>`file '${f.file}'\noption framerate 1000\nduration ${Math.max(.001,(frames[i+1]?.time||f.time+.08)-f.time).toFixed(6)}`).join('\n')+`\nfile '${frames.at(-1).file}'\noption framerate 1000\n`
  await writeFile(`${out}/frames.txt`,timeline)
  const encode=spawnSync('ffmpeg',['-v','error','-y','-f','concat','-safe','0','-i',`${out}/frames.txt`,'-vf','fps=30','-c:v','libx264','-threads','2','-preset','fast','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart',`${out}/complete-forest-journey.mp4`],{stdio:'inherit'})
  if(encode.status!==0)throw Error('Screen recording encoding failed')
  for(const [seam,event] of [['intro',perf.events.find(e=>e.type==='ended'&&e.src?.endsWith('reveal.mp4'))],['click',perf.events.find(e=>e.type==='click')],['awakening',perf.events.find(e=>e.type==='ended'&&e.src?.endsWith('awakening.mp4'))],['macro',perf.events.find(e=>e.type==='macro-entry')]]){
    if(!event)continue
    for(const offset of [-200,0,100,250,500,1000]){const time=Math.max(0,event.wall/1000-frames[0].time+offset/1000);spawnSync('ffmpeg',['-v','error','-y','-ss',String(time),'-i',`${out}/complete-forest-journey.mp4`,'-frames:v','1',`${out}/exact-${seam}-${offset}.png`])}
  }
  await rm(`${out}/frames`,{recursive:true,maxRetries:5,retryDelay:100});await rm(`${out}/frames.txt`)
  for(const [name,width,height] of process.env.SKIP_STATIC_VIEWS ? [] : [['mobile',390,844],['compact',390,664],['small',320,690]]){
    const p=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});await p.goto(target+'/');await p.evaluate(()=>document.fonts.ready)
    await p.screenshot({path:`${out}/${name}-lv-hero.png`,scale:'css'})
    await p.getByRole('button',{name:'Aplūkot piepi tuvāk',exact:true}).click();await p.screenshot({path:`${out}/${name}-lv-discovery.png`,scale:'css'});await p.getByRole('button',{name:'Aizvērt piepes stāstu'}).click()
    for(const id of ['understory','fungus-facts','return','wallpapers']){await p.locator('#'+id).scrollIntoViewIfNeeded();await p.waitForTimeout(500);await p.screenshot({path:`${out}/${name}-${id}.png`,scale:'css'})}await p.close()
  }
  console.log(`Saved complete real-browser recording, screenshots and lab observations to ${out}`)
} finally {await browser.close()}
