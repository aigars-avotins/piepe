import {test,expect} from '@playwright/test'

for(const [locale,width,height] of [['lv',1512,982],['en',390,844]] as const)test.describe(`3.1 photography ${locale} ${width}`,()=>{
 test.use({viewport:{width,height},screen:{width,height},deviceScaleFactor:1,isMobile:width<700,hasTouch:width<700})
 const guide=locale==='lv'?'/kas-ir-piepe/':'/en/what-is-a-bracket-fungus/'
 test('selected X-Ray explanations never move the viewport or mutate its hash',async({page})=>{
  await page.goto(guide);const view=page.locator('.xray-view');await view.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await expect(view).toHaveAttribute('data-images-ready','')
  const before=await page.evaluate(()=>({y:scrollY,url:location.href}));const points=page.getByRole('tab')
  for(let i=0;i<3;i++){
   await points.nth(i).click();await expect(points.nth(i)).toHaveAttribute('aria-selected','true');await expect(page.getByRole('tabpanel')).toHaveCount(1);expect(await page.evaluate(()=>scrollY)).toBe(before.y);expect(page.url()).toBe(before.url)
  }
  await points.nth(2).press('ArrowRight');await expect(points.nth(0)).toBeFocused();await expect(points.nth(0)).toHaveAttribute('aria-selected','true');expect(await page.evaluate(()=>scrollY)).toBe(before.y)
  await page.locator('[data-xray-range]').focus();await page.keyboard.press('Home');await page.keyboard.press('ArrowRight');await expect(points.nth(0)).toHaveAttribute('aria-selected','true')
 })
 test('Atlas gestures are independent from the explicit original-resolution comparison dialog',async({page,context})=>{
  await page.goto(guide+'#surface-atlas');const picture=page.locator('[data-atlas-surface]').first();await picture.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await expect(picture).toHaveAttribute('data-images-ready','');const url=page.url(),pages=context.pages().length,box=(await picture.boundingBox())!
  await page.mouse.move(box.x+box.width*.2,box.y+box.height*.5);await page.mouse.down();await page.mouse.move(box.x+box.width*.75,box.y+box.height*.5,{steps:8});await page.mouse.up();expect(page.url()).toBe(url);expect(context.pages().length).toBe(pages);await expect(page.locator('dialog[open]')).toHaveCount(0)
  await picture.focus();await picture.press('ArrowRight');await expect(picture).toHaveAttribute('data-magnifying','true');const open=page.locator('[data-atlas-open]').first();await open.click();const dialog=page.locator('[data-atlas-dialog]');await expect(dialog).toBeVisible();await expect(dialog.locator('img')).toHaveCount(3);expect(await dialog.locator('img').evaluateAll(imgs=>imgs.every(img=>img.getAttribute('src')?.endsWith('.jpg')&&!img.srcset))).toBe(true)
  await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();await expect(open).toBeFocused();expect(await page.locator('.atlas-original').first().getAttribute('target')).toBeNull()
 })
 test('Deadwood retains its fractional image mix and exposes one meaningful current image description',async({page})=>{
  const path=locale==='lv'?'/meza-piezimes/005-kritalas-un-laiks/':'/en/field-notes/005-deadwood-and-time/'
  await page.goto(path);await page.locator('.time-visual').evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));const range=page.locator('[data-time-range]')
  for(const value of [15,50,85]){
   await range.evaluate((e:HTMLInputElement,v)=>{e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}))},value);await expect(page.locator('[data-time-loading]')).not.toBeVisible();await expect(range).toHaveAttribute('aria-valuetext',new RegExp('^'+value+'%'))
   const expected=value/100*3,lower=Math.floor(expected),fraction=expected-lower
   await expect.poll(()=>page.locator('[data-time-figure]').evaluateAll(es=>es.map(e=>Number(getComputedStyle(e).opacity)))).toEqual([0,1,2,3].map(i=>i<=lower?1:i===lower+1?Math.round(fraction*1e6)/1e6:0))
   await expect(page.locator('.time-caption[aria-hidden=false]')).toHaveCount(1);await expect(page.locator('[data-time-composite]')).toHaveAttribute('aria-labelledby',/time-stage-\d-title time-caption-\d/)
  }
 })
})

test('3.1 actual HTML anchor nodes on all twenty routes obey the real-origin navigation policy',async({page,request})=>{
 const sitemap=await (await request.get('/sitemap.xml')).text();const paths=[...sitemap.matchAll(/<loc>https:\/\/pie\.pe([^<]+)<\/loc>/g)].map(match=>match[1]);expect(paths).toHaveLength(20);await page.goto('/kas-ir-piepe/')
 for(const path of paths){
  const response=await request.get(path);expect(response.status(),path).toBe(200);const html=await response.text();const links=await page.evaluate(markup=>[...new DOMParser().parseFromString(markup,'text/html').querySelectorAll('a')].map(a=>({href:a.getAttribute('href'),target:a.getAttribute('target'),rel:a.getAttribute('rel'),download:a.hasAttribute('download')})),html)
  expect(links.length).toBeGreaterThan(0)
  for(const link of links){expect(link.href,path).toBeTruthy();const url=new URL(link.href!,'https://pie.pe'+path),external=['http:','https:'].includes(url.protocol)&&!['https://pie.pe','http://pie.pe'].includes(url.origin)
   if(external){expect(link.target,`${path}: ${link.href}`).toBe('_blank');expect(link.rel?.split(/\s+/)).toEqual(expect.arrayContaining(['noopener','noreferrer']))}else expect(link.target,`${path}: ${link.href}`).toBeNull()
  }
 }
})

for(const locale of ['lv','en'] as const)test(`3.1 ${locale} real phone touch keeps Atlas gestures separate from navigation and explicit comparison`,async({browser,browserName})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true,recordVideo:{dir:test.info().outputPath('native-touch'),size:{width:390,height:844}}});let recording:import('@playwright/test').Video|null=null
 try{
  const page=await context.newPage();recording=page.video();await page.goto(locale==='lv'?'/kas-ir-piepe/':'/en/what-is-a-bracket-fungus/');const surface=page.locator('[data-atlas-surface]').first();await surface.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await expect(surface).toHaveAttribute('data-images-ready','');const b=(await surface.boundingBox())!,url=page.url();await page.touchscreen.tap(b.x+b.width*.4,b.y+b.height*.4);expect(page.url()).toBe(url);await expect(page.locator('[data-atlas-dialog]')).not.toBeVisible()
  if(browserName==='chromium'){
   await surface.evaluate(element=>{const samples:unknown[]=[];(window as unknown as {atlasTouchSamples:unknown[]}).atlasTouchSamples=samples;element.addEventListener('pointermove',event=>{const p=event as PointerEvent;samples.push({trusted:p.isTrusted,type:p.pointerType,x:p.clientX,y:p.clientY})})})
   const cdp=await context.newCDPSession(page)
   // A completed native gesture, with no residual fling. Raw CDP touchMove
   // packets suppress the next tap even on an independent plain HTML button.
   await cdp.send('Input.synthesizeScrollGesture',{x:b.x+b.width*.25,y:b.y+b.height*.5,xDistance:-b.width*.4,yDistance:0,speed:250,gestureSourceType:'touch',preventFling:true})
   await cdp.detach();const samples=await page.evaluate(()=>(window as unknown as {atlasTouchSamples:{trusted:boolean;type:string}[]}).atlasTouchSamples);expect(samples.length).toBeGreaterThan(3);expect(samples.every(p=>p.trusted&&p.type==='touch')).toBe(true);await test.info().attach('native-touch-drag',{body:JSON.stringify(samples),contentType:'application/json'})
   expect(page.url()).toBe(url);await expect(page.locator('[data-atlas-dialog]')).not.toBeVisible();expect(context.pages()).toHaveLength(1)
  }
  await page.locator('[data-atlas-open]').first().tap();await expect(page.locator('[data-atlas-dialog]')).toBeVisible();await expect.poll(()=>page.locator('[data-atlas-dialog] img').evaluateAll(imgs=>imgs.every(e=>(e as HTMLImageElement).naturalWidth===2400))).toBe(true);await page.locator('[data-atlas-close]').tap();await expect(page.locator('[data-atlas-open]').first()).toBeFocused();expect(page.url()).toBe(url);expect(context.pages()).toHaveLength(1)
 }finally{await context.close();if(recording)await test.info().attach('native-phone-touch',{path:await recording.path(),contentType:'video/webm'})}
})

test('3.1 intentional X-Ray deep links select one explanation and native Back restores the previous fragment',async({page})=>{
 await page.goto('/en/what-is-a-bracket-fungus/#xray-wood');await expect(page.locator('[data-xray-point=wood]')).toHaveAttribute('aria-selected','true');await expect(page.getByRole('tabpanel')).toHaveCount(1);await expect(page.locator('#xray-wood')).toBeVisible()
 await page.evaluate(()=>{location.hash='xray-hyphae'});await expect(page.locator('[data-xray-point=hyphae]')).toHaveAttribute('aria-selected','true');await page.goBack();await expect(page).toHaveURL(/#xray-wood$/);await expect(page.locator('[data-xray-point=wood]')).toHaveAttribute('aria-selected','true')
})
