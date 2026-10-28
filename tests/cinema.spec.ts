import {test,expect} from '@playwright/test'

test('server-painted controls and cover geometry survive delayed hydration without a layout jump',async({page})=>{
  await page.setViewportSize({width:390,height:844})
  let release!:()=>void;const gate=new Promise<void>(resolve=>{release=resolve})
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message))
  await page.route('**/assets/*.js',async route=>{await gate;await route.continue()})
  await page.goto('/',{waitUntil:'commit'})
  await page.getByRole('button',{name:'Izlaist ievadu'}).waitFor()
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.environment')!).position==='fixed')
  const before=await page.locator('.base-camera .media-plane').boundingBox()
  await page.evaluate(()=>{
    const state={button:document.querySelector('.skip-intro'),cls:0};(window as unknown as {hydration:typeof state}).hydration=state
    new PerformanceObserver(list=>{for(const e of list.getEntries() as (PerformanceEntry & {hadRecentInput:boolean;value:number})[])if(!e.hadRecentInput)state.cls+=e.value}).observe({type:'layout-shift'})
  })
  release();await page.waitForFunction(()=>!document.querySelector('.world')!.classList.contains('prerendered'))
  const after=await page.locator('.base-camera .media-plane').boundingBox()
  expect(after!.x).toBeCloseTo(before!.x,1);expect(after!.width).toBeCloseTo(before!.width,1);expect(after!.height).toBeCloseTo(before!.height,1)
  await expect.poll(()=>page.locator('video.forest-film').count()).toBe(1)
  const result=await page.evaluate(()=>{const state=(window as unknown as {hydration:{button:Element;cls:number}}).hydration;return {sameButton:state.button===document.querySelector('.skip-intro'),cls:state.cls}})
  expect(result.sameButton).toBe(true);expect(result.cls).toBeLessThan(.02);expect(errors).toEqual([])
})

for(const [width,height] of [[1512,982],[2560,1080],[390,664]]) test(`held frame and first decoded awakening stay in the same plane at ${width}x${height}`,async({page},testInfo)=>{
  await page.setViewportSize({width,height});await page.addInitScript(()=>sessionStorage.setItem('piepe-entered','1'))
  let release!:()=>void;const gate=new Promise<void>(resolve=>{release=resolve})
  await page.route('**/media/forest-awakening.mp4',async route=>{await gate;await route.continue()})
  await page.goto('/en/')
  const plane=page.locator('.base-camera .media-plane'),shade=page.locator('.forest-shade')
  const before=await plane.boundingBox(),grading=await shade.evaluate(e=>getComputedStyle(e).backgroundImage)
  await page.evaluate(()=>{
    const root=document.querySelector('.world')!;(window as unknown as { originalPlane:Element }).originalPlane=document.querySelector('.base-camera .media-plane')!
    const samples:{at:number;phase:string|null;dialog:boolean;frame:{x:number;y:number;w:number;h:number};ready:number}[]=[];(window as unknown as {seamSamples:typeof samples}).seamSamples=samples
    const collect=()=>{const e=document.querySelector('.base-camera .media-plane')!,r=e.getBoundingClientRect(),v=document.querySelector<HTMLVideoElement>('video[src$="awakening.mp4"]');samples.push({at:performance.now(),phase:root.getAttribute('data-awakening'),dialog:!!document.querySelector('dialog[open]'),frame:{x:r.x,y:r.y,w:r.width,h:r.height},ready:v?.readyState||0});if(root.getAttribute('data-awakening')!=='docking'&&samples.length<300)requestAnimationFrame(collect)};requestAnimationFrame(collect)
  })
  await page.getByRole('button',{name:'Look closer at the fungus',exact:true}).click()
  await expect(page.locator('.world')).toHaveAttribute('data-awakening','preparing')
  await expect(page.locator('dialog[open]')).toHaveCount(0)
  await expect(page.getByRole('button',{name:'Go straight to the field note'})).toBeVisible()
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity','1')
  await expect(page.locator('video[src$="awakening.mp4"]')).toHaveCSS('opacity','0')
  await page.screenshot({path:testInfo.outputPath('held-during-network-delay.png')})
  expect(await plane.boundingBox()).toEqual(before)
  expect(await shade.evaluate(e=>getComputedStyle(e).backgroundImage)).toBe(grading)
  release()
  await expect(page.locator('[data-clip="awakening"]')).toHaveAttribute('data-clip-ready','true')
  const timed = await page.evaluate(async () => {
    const start=performance.now(),frames=[]
    for(const ms of [0,100,250,500,1000]){
      await new Promise(resolve=>setTimeout(resolve,Math.max(0,ms-(performance.now()-start))))
      const r=document.querySelector('.base-camera .media-plane')!.getBoundingClientRect()
      frames.push({at:Number(document.timeline.currentTime)-start,x:r.x,y:r.y,w:r.width,h:r.height,dialog:!!document.querySelector('dialog[open]')})
    }
    return frames
  })
  for(const frame of timed){expect(frame.x).toBeCloseTo(before!.x,1);expect(frame.y).toBeCloseTo(before!.y,1);expect(frame.w).toBeCloseTo(before!.width,1);expect(frame.h).toBeCloseTo(before!.height,1);expect(frame.dialog).toBe(false)}
  await page.screenshot({path:testInfo.outputPath('first-second-presented.png')})
  await testInfo.attach('ready-plane-timestamps',{body:JSON.stringify(timed),contentType:'application/json'})
  expect(await page.evaluate(()=>(window as unknown as {originalPlane:Element}).originalPlane===document.querySelector('.base-camera .media-plane'))).toBe(true)
  const samples=await page.evaluate(()=>(window as unknown as {seamSamples:unknown[]}).seamSamples)
  await testInfo.attach('held-plane-timeline',{body:JSON.stringify(samples),contentType:'application/json'})
})

test('the decoded first frame retains local fungus edge anchors, not just a low whole-frame RGB error',async({page},testInfo)=>{
  await page.addInitScript(()=>{
    sessionStorage.setItem('piepe-entered','1')
    new MutationObserver(()=>{const v=document.querySelector<HTMLVideoElement>('video[src$="awakening.mp4"]');if(!v||v.dataset.qaWatched)return;v.dataset.qaWatched='1';v.requestVideoFrameCallback(()=>{
      const ref=new Image();ref.src='/media/forest-final.jpg'
      const compare=()=>{
        const a=document.createElement('canvas'),b=document.createElement('canvas');a.width=b.width=1920;a.height=b.height=1080;const ac=a.getContext('2d')!,bc=b.getContext('2d')!;ac.drawImage(v,0,0);bc.drawImage(ref,0,0)
        const anchors=[]
        for(const [x,y] of [[1050,390],[960,525],[1390,655]]){
          const w=120,h=70,ap=ac.getImageData(x,y,w,h).data,bp=bc.getImageData(x,y,w,h).data
          const edge=(p:Uint8ClampedArray)=>{const g=new Float64Array(w*h);for(let j=1;j<h-1;j++)for(let i=1;i<w-1;i++){const gray=(k:number)=>(p[k*4]+p[k*4+1]+p[k*4+2])/3;g[j*w+i]=Math.abs(gray(j*w+i+1)-gray(j*w+i-1))+Math.abs(gray((j+1)*w+i)-gray((j-1)*w+i))}return g}
          const ae=edge(ap),be=edge(bp);let best=-1,dx=0,dy=0
          for(let oy=-5;oy<=5;oy++)for(let ox=-5;ox<=5;ox++){let dot=0,aa=0,bb=0;for(let j=6;j<h-6;j++)for(let i=6;i<w-6;i++){const av=ae[j*w+i],bv=be[(j+oy)*w+i+ox];dot+=av*bv;aa+=av*av;bb+=bv*bv}const score=dot/Math.sqrt(aa*bb);if(score>best){best=score;dx=ox;dy=oy}}
          anchors.push({x,y,dx,dy,score:best})
        }
        ;(window as unknown as {firstFrame:unknown}).firstFrame={time:v.currentTime,anchors}
      };if(ref.complete)compare();else ref.onload=compare
    })}).observe(document,{childList:true,subtree:true})
  })
  await page.goto('/en/');await page.getByRole('button',{name:'Look closer at the fungus',exact:true}).click()
  await expect.poll(()=>page.evaluate(()=>(window as unknown as {firstFrame:unknown}).firstFrame)).toBeTruthy()
  const result=await page.evaluate(()=>(window as unknown as {firstFrame:{time:number;anchors:{dx:number;dy:number;score:number}[]}}).firstFrame)
  await testInfo.attach('local-edge-registration',{body:JSON.stringify(result),contentType:'application/json'})
  expect(result.time).toBeLessThan(.3)
  for(const anchor of result.anchors){expect(Math.hypot(anchor.dx,anchor.dy)).toBeLessThanOrEqual(2);expect(anchor.score).toBeGreaterThan(.8)}
})

for(const [width,height] of [[1512,982],[390,664]])test(`awakening final frame docks and returns continuously at ${width}x${height}`,async({page},testInfo)=>{
  test.setTimeout(25000);await page.setViewportSize({width,height});await page.addInitScript(()=>sessionStorage.setItem('piepe-entered','1'))
  await page.goto('/en/');await page.getByRole('button',{name:'Look closer at the fungus',exact:true}).click()
  await page.evaluate(()=>{
    const samples:{t:number;x:number;y:number;w:number;h:number;sx:number;sy:number}[]=[];(window as unknown as {dockFrames:typeof samples}).dockFrames=samples
    document.addEventListener('ended',e=>{if(!(e.target instanceof HTMLVideoElement)||!e.target.src.endsWith('awakening.mp4'))return;const start=Number(document.timeline.currentTime);const frame=()=>{const photo=document.querySelector('.specimen-photo');if(photo&&document.querySelector('dialog[open]')){const r=photo.getBoundingClientRect(),aperture=getComputedStyle(photo).clipPath;const [top,right=top,bottom=top,left=right]=aperture==='none'?[0]:aperture.slice(6,-1).split(' ').map(parseFloat);const matrix=new DOMMatrixReadOnly(getComputedStyle(photo.querySelector('img')!).transform);samples.push({t:Number(document.timeline.currentTime)-start,x:r.x+left,y:r.y+top,w:r.width-left-right,h:r.height-top-bottom,sx:matrix.a,sy:matrix.d})}if(Number(document.timeline.currentTime)-start<1400)requestAnimationFrame(frame)};requestAnimationFrame(frame)},true)
  })
  await expect(page.getByRole('heading',{name:/A small shelf/})).toBeVisible({timeout:12000})
  const frames=await page.evaluate(()=>(window as unknown as {dockFrames:{t:number;x:number;y:number;w:number;h:number;sx:number;sy:number}[]}).dockFrames)
  await testInfo.attach('photo-docking-frames',{body:JSON.stringify(frames),contentType:'application/json'})
  expect(frames.length).toBeGreaterThan(10)
  const first=frames[0];expect(first.w).toBeGreaterThan(width*.94);expect(first.h).toBeGreaterThan(height*.92)
  for(const frame of frames)expect(frame.sx).toBeCloseTo(frame.sy,4)
  for(let i=1;i<frames.length;i++){const dt=frames[i].t-frames[i-1].t;if(dt<1)continue;expect(Math.abs(frames[i].w-frames[i-1].w)/dt).toBeLessThan(3);expect(Math.abs(frames[i].h-frames[i-1].h)/dt).toBeLessThan(3)}
  await expect(page.getByRole('button',{name:'Close discovery'})).toBeFocused()
  await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible({timeout:2000});await expect(page.getByRole('button',{name:'Look closer at the fungus',exact:true})).toBeFocused()
  expect(await page.locator('.forest-still').getAttribute('src')).toBe('/media/forest-awakening-final.jpg')
})

test('Escape while preparing cancels in place; skip on retry opens the accessible note immediately',async({page})=>{
  await page.addInitScript(()=>sessionStorage.setItem('piepe-entered','1'));await page.route('**/media/forest-awakening.mp4',()=>{})
  await page.goto('/en/');const open=page.getByRole('button',{name:'Look closer at the fungus',exact:true});await open.click();await page.keyboard.press('Escape')
  await expect(page.locator('.world')).toHaveAttribute('data-awakening','idle');await expect(open).toBeFocused();await expect(page.locator('video')).toHaveCount(0)
  await open.click();const skip=page.getByRole('button',{name:'Go straight to the field note'});if(await skip.isVisible())await skip.click()
  await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('button',{name:'Close discovery'})).toBeFocused()
})

test('environmental cuts follow reversible scroll envelopes, not intersection-driven full-frame mounts',async({page})=>{
  await page.addInitScript(()=>sessionStorage.setItem('piepe-entered','1'));await page.goto('/en/')
  const samples=[]
  for(const p of [.95,.55,.15,.55,.95]){
    await page.evaluate(p=>scrollTo({top:document.getElementById('understory')!.offsetTop-innerHeight*p,behavior:'instant'}),p)
    await expect.poll(()=>page.locator('.understory-cinema').evaluate(e=>Number(getComputedStyle(e).opacity))).toBeGreaterThanOrEqual(0)
    await page.waitForTimeout(100);samples.push(await page.locator('.understory-cinema').evaluate(e=>Number(getComputedStyle(e).opacity)))
  }
  expect(samples[0]).toBeLessThan(.1);expect(samples[1]).toBeGreaterThan(.3);expect(samples[1]).toBeLessThan(.8);expect(samples[2]).toBeGreaterThan(.95);expect(samples[3]).toBeGreaterThan(.3);expect(samples[4]).toBeLessThan(.1)
  await page.evaluate(()=>scrollTo({top:document.getElementById('understory')!.offsetTop,behavior:'instant'}))
  const exit=[]
  for(const p of [1,.6,.2,.6,1]){
    await page.evaluate(p=>scrollTo({top:document.getElementById('encounter')!.offsetTop-innerHeight*p,behavior:'instant'}),p)
    await page.waitForTimeout(100);exit.push(await page.locator('.understory-cinema').evaluate(e=>Number(getComputedStyle(e).opacity)))
  }
  expect(exit[0]).toBeGreaterThan(.95);expect(exit[1]).toBeGreaterThan(.3);expect(exit[1]).toBeLessThan(.8);expect(exit[2]).toBeLessThan(.1);expect(exit[3]).toBeGreaterThan(.3);expect(exit[3]).toBeLessThan(.8);expect(exit[4]).toBeGreaterThan(.95)
})

test('unavailable end-still uses the actual decoded frame for a continuous note handoff',async({page})=>{
  await page.addInitScript(()=>sessionStorage.setItem('piepe-entered','1'))
  await page.route('**/media/forest-awakening-final.jpg',route=>route.abort())
  await page.goto('/en/');await page.getByRole('button',{name:'Look closer at the fungus',exact:true}).click()
  await expect(page.getByRole('heading',{name:/A small shelf/})).toBeVisible({timeout:12000})
  const source=await page.locator('.forest-still').getAttribute('src');expect(source).toMatch(/^data:image\/jpeg/)
  await expect(page.locator('.specimen-photo img')).toHaveAttribute('src',source!)
  expect(await page.locator('.specimen-photo img').evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBe(1920)
  await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Look closer at the fungus',exact:true})).toBeFocused()
})

test('locale change while decoding does not reopen a modal, move focus or restart playback',async({page})=>{
  await page.addInitScript(()=>sessionStorage.setItem('piepe-entered','1'));await page.route('**/media/forest-awakening.mp4',()=>{})
  await page.goto('/');await page.getByRole('button',{name:'Aplūkot piepi tuvāk',exact:true}).click()
  await page.getByRole('navigation',{name:'Valoda'}).getByRole('link',{name:'EN'}).click()
  await expect(page.locator('.world')).toHaveAttribute('data-awakening','preparing')
  await expect(page.getByRole('link',{name:'EN',exact:true})).toBeFocused();await expect(page.locator('dialog[open]')).toHaveCount(0)
  await page.getByRole('button',{name:'Go straight to the field note'}).click();await expect(page.getByRole('dialog')).toBeVisible()
})

test('Escape during the photo move reverses the current camera instead of snapping to full frame',async({page})=>{
  await page.setViewportSize({width:1512,height:982});await page.addInitScript(()=>sessionStorage.setItem('piepe-entered','1'))
  await page.goto('/en/');await page.getByRole('button',{name:'Look closer at the fungus',exact:true}).click()
  await page.waitForFunction(()=>document.querySelector('dialog[open]')&&parseFloat(getComputedStyle(document.querySelector('.specimen-photo')!).clipPath.slice(6,-1).split(' ')[1])>innerWidth*.1,null,{timeout:12000})
  await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toBeVisible()
  const width=await page.locator('.specimen-photo').evaluate(e=>{const insets=getComputedStyle(e).clipPath.slice(6,-1).split(' ').map(parseFloat);return e.getBoundingClientRect().width-insets[1]-insets[3]})
  expect(width).toBeLessThan(1512*.97)
  await expect(page.getByRole('dialog')).not.toBeVisible({timeout:2500});await expect(page.getByRole('button',{name:'Look closer at the fungus',exact:true})).toBeFocused()
})

test('a transient readiness drop at the presented-frame callback retries behind the held forest',async({page})=>{
  await page.addInitScript(()=>{
    sessionStorage.setItem('piepe-entered','1')
    const native=HTMLVideoElement.prototype.requestVideoFrameCallback
    HTMLVideoElement.prototype.requestVideoFrameCallback=function(callback){
      return native.call(this,(now,metadata)=>{
        if(this.src.endsWith('awakening.mp4')&&!this.dataset.droppedReadiness){
          this.dataset.droppedReadiness='true';Object.defineProperty(this,'readyState',{configurable:true,get:()=>1})
          callback(now,metadata);queueMicrotask(()=>{delete (this as unknown as {readyState?:number}).readyState})
        }else callback(now,metadata)
      })
    }
  })
  await page.goto('/en/');await page.getByRole('button',{name:'Look closer at the fungus',exact:true}).click()
  await expect(page.locator('[data-clip=awakening]')).toHaveAttribute('data-clip-ready','true')
  await expect(page.locator('.world')).toHaveAttribute('data-awakening','playing')
  await expect(page.locator('dialog[open]')).toHaveCount(0)
})
