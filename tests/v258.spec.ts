import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { messages, readingPath, localePath } from '../src/i18n'
import { forestPages, forestPath, notePath, fieldNotesPath } from '../src/forestPaths'
import { forestSchema } from '../src/ForestPage'
import { readings } from '../src/reading'
import { experienceCopy } from '../src/experienceCopy'
import { checkStaticMarkup } from './readingChecks'
import { nativeDiagnostics } from './nativeDiagnostics'
nativeDiagnostics()

async function audioProbe(page: Page, failFilter=false) {
  await page.addInitScript(fail=>{
    sessionStorage.setItem('piepe-entered','1')
    const qa={contexts:[] as AudioContext[],filters:[] as BiquadFilterNode[],gains:[] as GainNode[],sources:[] as AudioBufferSourceNode[],destinations:[] as string[]}
    ;(window as unknown as { forest258: typeof qa }).forest258=qa
    const Native=window.AudioContext
    window.AudioContext=class extends Native {
      constructor(options?: AudioContextOptions){super(options);qa.contexts.push(this)}
      createGain(){const gain=super.createGain();qa.gains.push(gain);return gain}
      createBiquadFilter(){if(fail)throw new DOMException('Filter unavailable for fallback validation','NotSupportedError');const filter=super.createBiquadFilter();qa.filters.push(filter);return filter}
      createBufferSource(){
        const source=super.createBufferSource(),connect=source.connect.bind(source)
        Object.defineProperty(source,'connect',{value:(to:AudioNode)=>{qa.destinations.push(qa.gains.includes(to as GainNode)?'gain':'filter');return connect(to)}})
        qa.sources.push(source);return source
      }
    }
  },failFilter)
}
async function graphState(page:Page){return page.evaluate(()=>{
  const q=(window as unknown as {forest258:{contexts:AudioContext[];filters:BiquadFilterNode[];gains:GainNode[];sources:AudioBufferSourceNode[];destinations:string[]}}).forest258
  return{contexts:q.contexts.length,state:q.contexts[0]?.state,filters:q.filters.length,frequency:q.filters[0]?.frequency.value,gains:q.gains.length,sources:q.sources.length,destinations:q.destinations,loop:q.sources[0]?.loop,duration:q.sources[0]?.buffer?.duration}
})}

for(const locale of ['lv','en'] as const){
  const t=experienceCopy[locale]
  test(`2.5.8 ${locale}: real static educational content and native atlas work without JavaScript`,async({browser})=>{
    const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}})
    try{
      const p=await context.newPage();await p.goto(readingPath(locale));await checkStaticMarkup(p)
      for(const story of t.xray.stories)await expect(p.locator('[data-xray]')).toContainText(story.text)
      await expect(p.locator('[data-xray-controls]')).toBeVisible();await expect(p.locator('[data-xray-range]')).toBeDisabled();await expect(p.locator('[data-atmosphere-controls]')).toHaveCount(0)
      await expect(p.locator('[data-atlas-open]').first()).toBeHidden();await expect(p.locator('.atlas-original').first()).toHaveAttribute('href','/images/interactive/atlas-pores.jpg');expect(await p.locator('.atlas-original').first().getAttribute('target')).toBeNull();await expect(p.locator('[data-atlas-card]').first().locator('img[data-interactive-image]')).toHaveAttribute('src','/images/interactive/atlas-pores.jpg')
      await expect(p.locator('[data-atlas-card]').first()).toContainText(t.atlas.cards[0].detail)
      await p.goto(notePath(locale,'005'));for(const stage of t.time.stages)await expect(p.locator('.time-stories')).toContainText(stage.text)
      await expect(p.locator('[data-time-controls]')).toBeVisible();await expect(p.locator('[data-time-range]')).toBeDisabled();await expect(p.locator('video,audio,#root')).toHaveCount(0)
      await expect(p.locator('[data-time-figure="0"]')).toHaveCSS('opacity','1')
    }finally{await context.close()}
  })

  test(`2.5.8 ${locale}: X-Ray native keyboard, actual pointer drag and hotspot focus reveal the same hidden layer`,async({page})=>{
    await page.goto(readingPath(locale));const range=page.locator('[data-xray-range]'),photo=page.locator('.xray-cutaway')
    await expect(page.locator('[data-xray-controls]')).toBeVisible();await range.focus();await range.press('Home');await expect(range).toHaveValue('0')
    await range.press('ArrowRight');await expect(range).toHaveValue('1');await expect(range).toHaveAttribute('aria-valuetext',`1% ${t.xray.output}`)
    await range.press('End');await expect(range).toHaveValue('100');await expect(page.locator('[data-xray-output]')).toContainText('100%')
    await range.press('Home');for(let i=0;i<5;i++)await range.press('ArrowRight')
    const before=await photo.evaluate(e=>getComputedStyle(e).clipPath),handle=page.locator('.xray-view');await handle.scrollIntoViewIfNeeded()
    const box=(await handle.boundingBox())!;await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+90,box.y+box.height/2,{steps:8});await page.mouse.up()
    expect(Number(await range.inputValue())).toBeGreaterThan(10);expect(await photo.evaluate(e=>getComputedStyle(e).clipPath)).not.toBe(before)
    const beforeSelection=await page.evaluate(()=>({url:location.href,y:scrollY}));await page.locator('[data-xray-point="hyphae"]').focus({});await page.keyboard.press('Enter')
    expect(page.url()).toBe(beforeSelection.url);expect(await page.evaluate(()=>scrollY)).toBe(beforeSelection.y);await expect(page.locator('#xray-hyphae')).toBeVisible();await expect(page.getByRole('tabpanel')).toHaveCount(1)
    await expect(page.locator('[data-xray-point="hyphae"]')).toBeFocused()
    await expect(page.locator('#xray-spores')).toContainText(t.xray.stories[2].text)
  })

  test(`2.5.8 ${locale}: the four deadwood stages move through a stable illustration and retain every factual caption`,async({page})=>{
    await page.goto(notePath(locale,'005'));const capsule=page.locator('[data-time-capsule]'),view=page.locator('.time-visual'),first=(await view.boundingBox())!
    for(let i=0;i<4;i++){
      await page.locator(`[data-time-choice="${i}"]`).click()
      // Photos dissolve, but only one caption remains visible.
      expect(await page.locator('[data-time-caption][aria-hidden="true"]').evaluateAll(es=>es.every(e=>getComputedStyle(e).visibility==='hidden'))).toBe(true)
      await expect(page.locator(`[data-time-figure="${i}"]`)).toHaveCSS('opacity','1')
      await expect(capsule).toHaveAttribute('data-stage',String(i));await expect(page.locator(`[data-time-choice="${i}"]`)).toHaveAttribute('aria-pressed','true')
      await expect(page.locator('[data-time-range]')).toHaveAttribute('aria-valuetext',`${Math.round(i/3*100)}% · ${t.time.stages[i].title}`)
      const next=(await view.boundingBox())!;expect(next.width).toBeCloseTo(first.width,1);expect(next.height).toBeCloseTo(first.height,1)
    }
    const range=page.locator('[data-time-range]');await range.focus();await range.press('Home');await expect(capsule).toHaveAttribute('data-stage','0');await range.press('End');await range.press('ArrowLeft');await expect(range).toHaveValue('99.9');await expect(capsule).toHaveAttribute('data-stage','3')
    for(const stage of t.time.stages){await expect(page.locator('.time-stories')).toContainText(stage.text);await expect(page.locator(stage.source)).toHaveCount(1)}
    await expect(page.locator('#time-scenario')).toHaveText(t.time.scenario);await expect(page.locator('video,audio,#root')).toHaveCount(0)
  })

  test(`2.5.8 ${locale}: atlas opens full-resolution comparison, closes with Escape and restores link focus`,async({page})=>{
    await page.goto(readingPath(locale))
    const link=page.locator('[data-atlas-open]').first();await link.focus();await link.press('Enter')
    const dialog=page.locator('[data-atlas-dialog]');await expect(dialog).toBeVisible();await expect(dialog.locator('img')).toHaveCount(3)
    await expect.poll(()=>dialog.locator('img').first().evaluate((e:HTMLImageElement)=>e.naturalWidth)).toBe(2400)
    await page.keyboard.press('Escape');await expect(dialog).toBeHidden();await expect(link).toBeFocused()
    const other=page.locator('[data-atlas-open]').nth(2);await other.click();await expect(dialog.locator('figcaption').first()).toHaveText(t.atlas.cards[2].title)
    await dialog.locator('[data-atlas-close]').click();await expect(dialog).toBeHidden();await expect(other).toBeFocused()
    await expect(page.locator('.experience-caution')).toHaveText(t.atlas.caution)
  })

  test(`3.1.1 ${locale}: a retired Nightfall preference cannot change first paint or native document history`,async({page})=>{
    const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message))
    await page.addInitScript(()=>{
      if(!sessionStorage.getItem('theme-test-initialized')){localStorage.setItem('piepe-atmosphere','nightfall');localStorage.setItem('piepe-forest-sound','off');sessionStorage.setItem('theme-test-initialized','1')}
      const firstStyledContent=()=>{if(document.querySelector('main')&&document.styleSheets.length)(window as unknown as {firstAppearance:string}).firstAppearance=getComputedStyle(document.documentElement).getPropertyValue('--bg-primary');else requestAnimationFrame(firstStyledContent)}
      requestAnimationFrame(firstStyledContent)
    })
    await page.goto(readingPath(locale));await expect(page.locator('[data-atmosphere-controls]')).toHaveCount(0)
    await expect.poll(()=>page.evaluate(()=>(window as unknown as {firstAppearance:string}).firstAppearance)).toBe('#172017')
    await expect(page.locator('body')).toHaveCSS('background-color','rgb(23, 32, 23)');await expect.poll(()=>page.evaluate(()=>localStorage.getItem('piepe-atmosphere'))).toBeNull()
    await page.goto(fieldNotesPath(locale));await expect(page.locator('body')).toHaveCSS('background-color','rgb(23, 32, 23)')
    await page.goto(localePath(locale));await expect(page.locator('.world')).not.toHaveClass(/prerendered/);await expect(page.locator('[data-atmosphere-controls]')).toHaveCount(0)
    await page.goBack();await expect(page).toHaveURL(new RegExp(fieldNotesPath(locale)+'$'));await expect(page.locator('body')).toHaveCSS('background-color','rgb(23, 32, 23)');expect(errors).toEqual([])
  })
}

test('2.5.8 touch slider gestures and vertical page movement remain native',async({browser,browserName})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})
  try{
    const p=await context.newPage();await p.goto('/kas-ir-piepe/');const range=p.locator('[data-xray-range]');await range.scrollIntoViewIfNeeded();const box=(await range.boundingBox())!
    // Both photographs cover the same 16:9 viewport without letterboxing.
    expect(await p.locator('.xray-images img').evaluateAll(es=>es.every(e=>getComputedStyle(e).objectFit==='cover'))).toBe(true)
    await p.touchscreen.tap(box.x+box.width*.8,box.y+box.height/2);expect(Number(await range.inputValue())).toBeGreaterThan(55)
    if(browserName==='chromium'){
      await p.locator('.xray-view').scrollIntoViewIfNeeded();const handle=(await p.locator('.xray-view').boundingBox())!,x=handle.x+handle.width/2,y=handle.y+handle.height/2,start=Number(await range.inputValue()),cdp=await context.newCDPSession(p)
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]})
      for(let step=1;step<=8;step++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-step*9,y}]})
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});expect(Number(await range.inputValue())).toBeLessThan(start-10)
      const before=await p.evaluate(()=>scrollY);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:160,y:600}]});for(let step=1;step<=7;step++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:160,y:600-step*35}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect.poll(()=>p.evaluate(()=>scrollY)).toBeGreaterThan(before+100)
    }else{await range.focus();await range.press('Home');await range.press('End');await expect(range).toHaveValue('100')}
  }finally{await context.close()}
})

for(const mode of ['reduced','save-data'] as const)test(`2.5.8 ${mode}: illustrations remain factual and controllable with no pulses or transition clocks`,async({page})=>{
  if(mode==='reduced')await page.emulateMedia({reducedMotion:'reduce'})
  else await page.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true},configurable:true}))
  await page.goto('/en/what-is-a-bracket-fungus/');const range=page.locator('[data-xray-range]');await range.focus();await range.press('End')
  await expect(page.locator('.xray-cutaway')).toHaveCSS('transition-duration','0s')
  await page.goto('/en/field-notes/005-deadwood-and-time/');await page.locator('[data-time-choice="3"]').click();await expect(page.locator('[data-time-figure="3"]')).toHaveCSS('opacity','1');await expect(page.locator('[data-time-figure="3"]')).toHaveCSS('transition-duration','0s')
  await expect(page.locator('video,audio')).toHaveCount(0)
})

test('3.1.1 invalid and denied storage retain the single approved appearance and native language links',async({browser})=>{
  for(const denied of [false,true]){
    const context=await browser.newContext({viewport:{width:390,height:844}})
    try{
      await context.addInitScript(deny=>{if(deny){for(const method of ['getItem','setItem','removeItem'])Object.defineProperty(Storage.prototype,method,{value:()=>{throw new DOMException('Denied','SecurityError')}})}else localStorage.setItem('piepe-atmosphere','not-a-mode')},denied)
      const p=await context.newPage(),errors:string[]=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('/en/forest-wallpapers/');await expect(p.locator('[data-atmosphere-controls]')).toHaveCount(0);await expect(p.locator('body')).toHaveCSS('background-color','rgb(23, 32, 23)');await p.locator('.reading-languages a[lang="lv"]').click();await expect(p).toHaveURL(/\/meza-foni\/$/);await expect(p.locator('body')).toHaveCSS('background-color','rgb(23, 32, 23)');expect(errors).toEqual([])
    }finally{await context.close()}
  }
})

test('2.5.8 audio is gesture-gated, depth-reactive and shares one real source through the existing scene states',async({page})=>{
  test.setTimeout(35000);await audioProbe(page)
  const requests:string[]=[];page.on('request',r=>{if(r.url().includes('forest-ambience.mp3'))requests.push(r.url())})
  await page.goto('/en/');await expect(page.locator('.world')).not.toHaveClass(/prerendered/);expect((await graphState(page)).contexts).toBe(0);expect(requests).toEqual([])
  await page.evaluate(()=>document.dispatchEvent(new KeyboardEvent('keydown',{key:'a',bubbles:true})));expect((await graphState(page)).contexts).toBe(0)
  await page.locator('.site-header a[lang=lv]').click();await expect(page.getByRole('button',{name:messages.lv.muteSound,exact:true})).toHaveAttribute('data-audio-state','playing',{timeout:10000})
  expect(await graphState(page)).toMatchObject({contexts:1,filters:1,gains:1,sources:1,destinations:['filter'],loop:true});expect((await graphState(page)).duration).toBeGreaterThan(59)
  await page.locator('#understory').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await expect(page.locator('.world')).toHaveAttribute('data-scene','understory')
  await expect.poll(async()=>(await graphState(page)).frequency!).toBeLessThan(12000);const enclosed=(await graphState(page)).frequency!
  await page.locator('#return').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await expect(page.locator('.world')).toHaveAttribute('data-scene','return')
  await expect.poll(async()=>(await graphState(page)).frequency!).toBeGreaterThan(enclosed+3000)
  expect((await graphState(page)).sources).toBe(1);expect(requests).toHaveLength(1)
  // Controlled visibility events exercise the lifecycle; this is not an OS background/GPU measurement.
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{get:()=>true,configurable:true});document.dispatchEvent(new Event('visibilitychange'))})
  await expect.poll(async()=>(await graphState(page)).state).toBe('suspended')
  await page.evaluate(()=>{Reflect.deleteProperty(document,'hidden');document.dispatchEvent(new Event('visibilitychange'))})
  await expect.poll(async()=>(await graphState(page)).state).toBe('running');expect((await graphState(page)).sources).toBe(1);expect(requests).toHaveLength(1)
  await page.getByRole('button',{name:messages.lv.muteSound,exact:true}).click();await expect.poll(async()=>(await graphState(page)).state).toBe('suspended')
  await page.reload();await expect(page.getByRole('button',{name:messages.lv.enableSound,exact:true})).toHaveAttribute('data-audio-state','muted');expect((await graphState(page)).contexts).toBe(0)
})

test('2.5.8 unsupported low-pass processing falls back to the unchanged native recording',async({page})=>{
  await audioProbe(page,true);await page.goto('/en/');await page.locator('.site-header a[lang=lv]').click();await expect(page.getByRole('button',{name:messages.lv.muteSound,exact:true})).toHaveAttribute('data-audio-state','playing',{timeout:10000})
  expect(await graphState(page)).toMatchObject({contexts:1,filters:0,gains:1,sources:1,destinations:['gain'],loop:true});expect((await graphState(page)).duration).toBeGreaterThan(59)
})

test('2.5.8 unavailable Web Audio retains real gesture-gated native recording playback and mute',async({page})=>{
  await page.addInitScript(()=>{
    sessionStorage.setItem('piepe-entered','1')
    Object.defineProperty(window,'AudioContext',{value:undefined,configurable:true});Object.defineProperty(window,'webkitAudioContext',{value:undefined,configurable:true})
    const Native=window.Audio,recordings:HTMLAudioElement[]=[]
    ;(window as unknown as {forestRecording258:HTMLAudioElement[]}).forestRecording258=recordings
    window.Audio=class extends Native{constructor(src?:string){super(src);recordings.push(this)}}
  })
  const state=()=>page.evaluate(()=>{const r=(window as unknown as {forestRecording258:HTMLAudioElement[]}).forestRecording258;return{count:r.length,time:r[0]?.currentTime,paused:r[0]?.paused,loop:r[0]?.loop,duration:r[0]?.duration,volume:r[0]?.volume,src:r[0]?.currentSrc}})
  await page.goto('/en/');await expect(page.locator('.world')).not.toHaveClass(/prerendered/);expect((await state()).count).toBe(0)
  await page.locator('.site-header a[lang=lv]').click();await expect(page.getByRole('button',{name:messages.lv.muteSound,exact:true})).toHaveAttribute('data-audio-state','playing',{timeout:10000})
  await expect.poll(async()=>(await state()).time!).toBeGreaterThan(.2);const first=await state();expect(first).toMatchObject({count:1,paused:false,loop:true,volume:.22});expect(first.duration).toBeGreaterThan(59);expect(first.src).toContain('/audio/forest-ambience.mp3')
  await expect.poll(async()=>(await state()).time!).toBeGreaterThan(first.time!+.2)
  await page.getByRole('button',{name:messages.lv.muteSound,exact:true}).click();expect((await state()).paused).toBe(true)
  await page.getByRole('button',{name:messages.lv.enableSound,exact:true}).click();await expect.poll(async()=>(await state()).time!).toBeGreaterThan(first.time!+.3);expect((await state()).count).toBe(1)
})

test('2.5.8 every route has exact authorized inline hashes, genuine breadcrumbs and immutable cinema assets',async({request,page})=>{
  const policy=/Content-Security-Policy: (.+)/.exec(await readFile('dist/_headers','utf8'))![1],paths=['/','/en/',readingPath('lv'),readingPath('en'),...forestPages.flatMap(p=>[forestPath('lv',p),forestPath('en',p)])]
  // The retired colour bootstrap is gone: one home bootstrap + 20 document JSON-LD hashes.
  expect([...policy.matchAll(/sha256-/g)]).toHaveLength(21);expect(policy).not.toMatch(/script-src[^;]*(?:unsafe-inline|unsafe-eval|https:|\*)/)
  for(const path of paths){
    const response=await request.get(path),html=await response.text();expect(response.status()).toBe(200)
    const ids=await page.evaluate(markup=>[...new DOMParser().parseFromString(markup,'text/html').querySelectorAll('[id]')].map(element=>element.id),html)
    expect(ids.length,`${path}: DOM and SVG IDs must share a collision-free namespace`).toBe(new Set(ids).size)
    for(const script of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g))expect(policy).toContain(`'sha256-${createHash('sha256').update(script[1]).digest('base64')}'`)
  }
  for(const locale of ['lv','en'] as const)for(const number of ['001','002','003','004','005','006'] as const){
    const data=forestSchema(locale,{kind:'note',number}) as ReturnType<typeof forestSchema>&{breadcrumb:{'@type':string;itemListElement:{position:number;name:string;item:string}[]}}
    expect(data.breadcrumb['@type']).toBe('BreadcrumbList');expect(data.breadcrumb.itemListElement.map(x=>x.position)).toEqual([1,2]);await page.goto(notePath(locale,number))
    await expect(page.locator('.knowledge-trail')).toContainText(data.breadcrumb.itemListElement[0].name);await expect(page.locator('.knowledge-trail')).toContainText(data.breadcrumb.itemListElement[1].name)
  }
  const fixture=JSON.parse(await readFile('docs/qa/v258/baseline-inventory.json','utf8'))
  const reviewed:Record<string,string>=JSON.parse(await readFile('docs/qa/v311/reviewed-sources.json','utf8'))
  for(const[path,hash]of Object.entries({...fixture.publicAssets,...reviewed}))expect(createHash('sha256').update(await readFile(path)).digest('hex'),path).toBe(hash)
  // Only the Issue #34 reviewed caption/snippet/download/storage files change.
  // The independent original header prefix and all camera/Worker/media pins remain enforced.
  expect(Object.keys(reviewed).sort()).toEqual(['public/_headers','public/boot.js','src/Discovery.tsx','src/style.css'])
  expect(createHash('sha256').update((await readFile('public/_headers','utf8')).split('/wallpapers/piepe-forest-desktop-5120x2880.jpg')[0]).digest('hex')).toBe(fixture.sources['public/_headers'])
  for(const path of ['src/useForestMotion.ts','src/MotionClip.tsx','src/EnvironmentalFilm.tsx','src/IntroFilm.tsx','src/ForestScene.tsx','src/Discovery.tsx','src/usePhotoHandoff.ts','src/style.css','src/worker.ts','wrangler.jsonc','public/_headers'])expect(createHash('sha256').update(await readFile(path)).digest('hex'),path).toBe(reviewed[path]??fixture.sources[path])
  const guide=await(await request.get(readingPath('lv'))).text(),home=await(await request.get('/')).text(),entry=/src="(\/assets\/[^"]+\.js)"/.exec(home)![1],bundle=await readFile('dist'+entry,'utf8');expect(guide).toContain(experienceCopy.lv.xray.stories[0].text);expect(bundle).toContain(experienceCopy.lv.xray.stories[0].text);expect(bundle).not.toContain(readings.lv.sections[1].paragraphs[0]) // Shared homepage X-Ray is intentional in 2.5.8.1; long-form guide still stays static.
})

test('2.5.8 public route baseline remains real HTML on the independent CI network',async({request},info)=>{
  test.skip(!process.env.CI,'Managed-network HTTP is recorded separately; this read-only check establishes a second network in final CI.')
  test.setTimeout(60000)
  const paths=['/','/en/',readingPath('lv'),readingPath('en'),...forestPages.flatMap(p=>[forestPath('lv',p),forestPath('en',p)])],rows=[]
  for(const path of paths){
    const response=await request.get('https://pie.pe'+path),head=await request.head('https://pie.pe'+path),html=await response.text(),policy=response.headers()['content-security-policy']
    expect(response.status()).toBe(200);expect(head.status()).toBe(200);expect(response.headers()['content-type']).toContain('text/html');expect(html.match(/<h1(?:\s|>)/g)||[]).toHaveLength(1)
    expect(html).toContain(`rel="canonical" href="https://pie.pe${path}"`);expect(policy).toContain("script-src 'self'");expect(policy).not.toMatch(/script-src[^;]*(?:unsafe-inline|unsafe-eval)/)
    const data=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];expect(data).toHaveLength(1);expect(JSON.parse(data[0][1]).url).toBe('https://pie.pe'+path)
    rows.push({path,get:response.status(),head:head.status(),version:/data-version="([^"]+)"/.exec(html)?.[1],cfRay:response.headers()['cf-ray']})
  }
  await info.attach('independent-production-baseline',{body:JSON.stringify(rows,null,2),contentType:'application/json'})
})
