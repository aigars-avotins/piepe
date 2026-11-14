import {test,expect} from '@playwright/test'
import {messages,readingPath} from '../src/i18n'
import {wallpaperDesigns,wallpaperAsset} from '../src/wallpapers'
import {wallpapersPath,notePath} from '../src/forestPaths'
import {readFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {releaseVersion} from '../src/release'
import {nativeDiagnostics} from './nativeDiagnostics'
nativeDiagnostics()

for(const locale of ['lv','en'] as const)for(const[width,height]of[[2048,1200],[1512,982],[390,844],[320,568]])test.describe(`3.1.1 layout ${locale} ${width}`,()=>{
 test.use({viewport:{width,height},screen:{width,height},isMobile:width<700,hasTouch:width<700,deviceScaleFactor:1})
 test(`3.1.1 ${locale} ${width}: gallery captions remain inside their cards and divider rules stay between rows`,async({page})=>{
 await page.setViewportSize({width,height});await page.addInitScript(()=>sessionStorage.setItem('piepe-entered','1'));await page.goto(locale==='lv'?'/':'/en/');await expect(page.locator('.world')).not.toHaveClass(/prerendered/);await page.evaluate(()=>document.fonts.ready)
 const cards=page.locator('.exploration-gateways>a');await cards.first().scrollIntoViewIfNeeded()
 for(const card of await cards.all()){
  const measure=await card.evaluate(e=>{const box=e.getBoundingClientRect(),text=e.querySelector('.gateway-text')!.getBoundingClientRect(),photo=e.querySelector('.gateway-photo')!.getBoundingClientRect();return{card:box.bottom,text:text.bottom,photoBottom:photo.bottom,textTop:text.top,ratio:photo.width/photo.height}})
  expect(measure.text).toBeLessThanOrEqual(measure.card+.5);expect(measure.textTop).toBeGreaterThanOrEqual(measure.photoBottom-.5);expect(measure.ratio).toBeCloseTo(7/4,2)
 }
 const separation=await page.evaluate(()=>document.querySelector('.fact-observations')!.getBoundingClientRect().top-document.querySelector('.exploration-gateways')!.getBoundingClientRect().bottom)
 expect(separation).toBeGreaterThanOrEqual(width<700?39:69);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
 const hero=page.locator('.hero');await hero.scrollIntoViewIfNeeded();await expect(hero).not.toContainText(locale==='lv'?'Ceļojums piepē':'Journey into the fungus');await expect(page.locator('.discovery-entry')).toHaveAttribute('href','#encounter');await expect(page.locator('[data-atmosphere-controls]')).toHaveCount(0)
 for(const selector of ['.hero-copy>.label','.fungus-annotation>span:last-child','.chapter-label .label'])for(const e of await page.locator(selector).all()){await expect(e).toHaveCSS('background-color','rgba(0, 0, 0, 0)');await expect(e).toHaveCSS('background-image','none')}
 for(const selector of ['.fungus-annotation>span:last-child','.chapter-label .label'])for(const e of await page.locator(selector).all())expect(await e.evaluate(e=>getComputedStyle(e,'::before').backgroundImage)).toContain('closest-side')
 })
})

for(const path of ['/','/en/','/kas-ir-piepe/','/en/what-is-a-bracket-fungus/'])test(`3.1.1 ${path}: failed X-Ray images disable visual manipulation and Retry restores the real pair`,async({page})=>{
 let fail=true;await page.route('**/images/interactive/**',r=>fail&&r.request().url().includes('xray-')?r.abort():r.continue());await page.route('**/wallpapers/previews/desktop.webp*',r=>fail?r.abort():r.continue());await page.addInitScript(()=>sessionStorage.setItem('piepe-entered','1'));await page.goto(path)
 const section=page.locator('[data-xray]'),view=section.locator('.xray-view'),range=section.locator('[data-xray-range]');await view.scrollIntoViewIfNeeded();await expect(view).toHaveAttribute('data-image-error','');await expect(range).toBeDisabled();await expect(section.locator('[data-xray-point]').first()).toHaveAttribute('aria-disabled','true');await expect(section.locator('.xray-grip')).not.toBeVisible();await expect(view.locator('[data-image-retry]')).toBeVisible()
 fail=false;await view.locator('[data-image-retry]').click();await expect(view).toHaveAttribute('data-images-ready','');await expect(range).toBeEnabled();await expect(section.locator('[data-xray-point]').first()).toHaveAttribute('aria-disabled','false');const y=await page.evaluate(()=>scrollY),url=page.url();await section.locator('[data-xray-point=hyphae]').click();expect(await page.evaluate(()=>scrollY)).toBe(y);expect(page.url()).toBe(url);await expect(section.locator('[data-xray-point=hyphae]')).toHaveAttribute('aria-selected','true');await range.focus();await range.press('End');await expect(range).toHaveValue('100')
})

for(const locale of ['lv','en']as const)test(`3.1.1 ${locale}: all three failed Atlas images keep original links and recover deliberate comparison`,async({page})=>{
 let fail=true;await page.route('**/images/interactive/**',r=>fail&&r.request().url().includes('atlas-')?r.abort():r.continue());await page.route('**/wallpapers/previews/desktop.webp*',r=>fail?r.abort():r.continue());await page.goto(readingPath(locale));const atlas=page.locator('[data-atlas]');await atlas.locator('.atlas-cards').scrollIntoViewIfNeeded();await expect(atlas.locator('.atlas-picture[data-image-error]')).toHaveCount(3);await expect.poll(()=>atlas.locator('img[data-interactive-image]').evaluateAll(es=>es.every(i=>i.getAttribute('data-image-state')==='failed'))).toBe(true)
 for(const card of await atlas.locator('[data-atlas-card]').all()){await expect(card.locator('[data-atlas-open]')).toBeDisabled();await expect(card.locator('[data-atlas-surface]')).toHaveAttribute('tabindex','-1');await expect(card.locator('[data-image-retry]')).toBeVisible();await expect(card.locator('[data-image-retry]')).toBeEnabled();await expect(card.locator('.atlas-original')).toHaveAttribute('href',/\/images\/interactive\/atlas-.*\.jpg$/)}
 fail=false;for(const card of await atlas.locator('[data-atlas-card]').all()){await card.locator('[data-image-retry]').click();await expect(card.locator('[data-atlas-surface]')).toHaveAttribute('data-images-ready','');await expect(card.locator('[data-atlas-open]')).toBeEnabled()}
 await atlas.locator('[data-atlas-open]').first().click();const dialog=atlas.locator('dialog');await expect(dialog).toBeVisible();await expect.poll(()=>dialog.locator('img').first().evaluate((i:HTMLImageElement)=>i.naturalWidth)).toBe(2400);await page.keyboard.press('Escape');await expect(dialog).toBeHidden();await expect(atlas.locator('[data-atlas-open]').first()).toBeFocused()
})

for(const locale of ['lv','en']as const)test(`3.1.1 ${locale}: numbered navigation matches real chapters and one sound control belongs to each active surface`,async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.addInitScript(()=>{sessionStorage.setItem('piepe-entered','1');localStorage.setItem('piepe-forest-sound','off')});await page.goto(locale==='lv'?'/':'/en/');await expect(page.locator('.world')).not.toHaveClass(/prerendered/)
 expect(await page.locator('.journey-index a').evaluateAll(es=>es.map(e=>({href:e.getAttribute('href'),number:e.querySelector('span')!.textContent})))).toEqual([{href:'#forest',number:'00'},{href:'#understory',number:'01'},{href:'#encounter',number:'02'},{href:'#return',number:'03'}])
 await expect(page.getByRole('button',{name:messages[locale].enableSound,exact:true})).toHaveCount(1);await page.locator('.fungus-annotation').click();await expect(page.locator('.discovery-dialog')).toBeVisible();await expect(page.getByRole('button',{name:messages[locale].enableSound,exact:true})).toHaveCount(1);await page.keyboard.press('Escape');await expect(page.locator('.discovery-dialog')).not.toBeVisible();await page.locator('[data-portal-entry]').click();await expect(page.locator('.fungus-portal')).toBeVisible();await expect(page.getByRole('button',{name:messages[locale].enableSound,exact:true})).toHaveCount(1)
 const ids=await page.locator('.sound-control[aria-describedby]').evaluateAll(es=>es.map(e=>e.getAttribute('aria-describedby')));expect(new Set(ids).size).toBe(ids.length);for(const id of ids)await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);await page.keyboard.press('Escape');await expect(page.locator('.fungus-portal')).toHaveCount(0)
})

for(const locale of ['lv','en']as const)test(`3.1.1 ${locale}: closed dialog is excluded from snippets while its canonical Field Note remains readable`,async({page,request})=>{
 const home=await(await request.get(locale==='lv'?'/':'/en/')).text();await page.goto(readingPath(locale));const html=await page.evaluate(markup=>{const doc=new DOMParser().parseFromString(markup,'text/html');return{stage:doc.querySelector('.discovery-stage')?.hasAttribute('data-nosnippet'),text:doc.querySelector('.discovery-stage[data-nosnippet]')?.textContent,open:doc.querySelector('.discovery-dialog')?.hasAttribute('open'),canonical:doc.querySelector('link[rel=canonical]')?.getAttribute('href')}},home)
 expect(html.stage).toBe(true);expect(html.open).toBe(false);expect(html.text).toContain(messages[locale].closeDiscovery);expect(html.canonical).toBe('https://pie.pe'+(locale==='lv'?'/':'/en/'))
 await page.goto(notePath(locale,'001'));await expect(page.locator('main')).toContainText(messages[locale].observations[0].text);await expect(page.locator('main[data-nosnippet]')).toHaveCount(0);await expect(page.locator('[data-atmosphere-controls]')).toHaveCount(0)
})

for(const locale of ['lv','en']as const)test(`3.1.1 ${locale}: new wallpaper galleries have accurate originals, live previews and native download delivery`,async({page,context,request})=>{
 test.setTimeout(45000);await page.goto(wallpapersPath(locale));const schema=JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);expect(schema.image).toHaveLength(6)
 for(const design of wallpaperDesigns){const section=page.locator('#'+design.id);await expect(section.getByRole('heading',{level:2})).toHaveText(design.title[locale]);for(const device of ['desktop','mobile']as const){
  const asset=wallpaperAsset(design.id,device),preview=section.locator(`img[src="${asset.preview}"]`);await preview.scrollIntoViewIfNeeded();await expect.poll(()=>preview.evaluate((e:HTMLImageElement)=>e.naturalWidth)).toBe(asset.previewWidth);await expect(preview).toHaveAttribute('alt',device==='desktop'?design.desktopAlt[locale]:design.mobileAlt[locale]);const meta=schema.image.find((x:{contentUrl:string})=>x.contentUrl==='https://pie.pe'+asset.url);expect(meta).toMatchObject({width:asset.width,height:asset.height,encodingFormat:'image/jpeg',isBasedOn:{width:asset.originalWidth,height:asset.originalHeight,contentUrl:'https://pie.pe'+asset.original}})
  const head=await request.head(asset.url);expect(head.status()).toBe(200);expect(head.headers()['content-type']).toContain('image/jpeg');expect(head.headers()['content-disposition']).toContain("filename*=UTF-8''"+asset.url.split('/').at(-1));expect(head.headers()['x-content-type-options']).toBe('nosniff');expect((await request.head(asset.preview)).headers()['content-disposition']).toBeUndefined()
  const url=page.url(),event=page.waitForEvent('download');await section.locator(`a[href="${asset.url}"]`).click();const download=await event;expect(download.suggestedFilename()).toBe(asset.url.split('/').at(-1));const disk=await download.path();expect(disk).toBeTruthy();expect(createHash('sha256').update(await readFile(disk!)).digest('hex')).toBe(createHash('sha256').update(await readFile('public'+asset.url)).digest('hex'));expect(page.url()).toBe(url);expect(context.pages()).toHaveLength(1)
 }}
})

test('3.1.1 the homepage never requests new full-resolution wallpaper downloads',async({page})=>{
 const masters:string[]=[];page.on('request',r=>{if(/\/wallpapers\/(?:originals\/|piepe-(?:ancient|hidden)-forest-)/.test(r.url()))masters.push(r.url())});await page.addInitScript(()=>sessionStorage.setItem('piepe-entered','1'));await page.goto('/en/');await page.locator('.wallpaper-new-designs').scrollIntoViewIfNeeded();await expect(page.locator('.wallpaper-new-designs a')).toHaveCount(2);expect(masters).toEqual([])
})

if(process.platform==='darwin')test('3.1.1 native Mac production-before/candidate-after screenshots and independent Googlebot-like redirect',async({browser,request,baseURL},info)=>{
 test.setTimeout(120000)
 const live=await request.get('https://pie.pe/');expect(live.status()).toBe(200);const productionVersion=/data-version="([^"]+)"/.exec(await live.text())?.[1];expect(productionVersion).toMatch(/^\d+\.\d+\.\d+$/);await info.attach('native-comparison-versions',{body:JSON.stringify({productionVersion,candidateVersion:releaseVersion}),contentType:'application/json'})
 const traces=[]
 for(const method of ['get','head']as const){const response=await request[method]('https://pie.pe/en',{maxRedirects:0,headers:{'User-Agent':'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'}});expect(response.status()).toBe(307);expect(['/en/','https://pie.pe/en/']).toContain(response.headers().location);traces.push({method,status:response.status(),location:response.headers().location,cfRay:response.headers()['cf-ray'],date:response.headers().date})}
 expect((await request.get('https://pie.pe/en/')).status()).toBe(200);await info.attach('native-edge-redirect',{body:JSON.stringify(traces),contentType:'application/json'})
 for(const locale of ['lv','en']as const)for(const[width,height]of[[1512,982],[390,844]])for(const[phase,origin]of[['before','https://pie.pe'],['after',baseURL!]]){
  const context=await browser.newContext({viewport:{width,height},screen:{width,height},isMobile:width<700,hasTouch:width<700,deviceScaleFactor:1});await context.addInitScript(()=>{sessionStorage.setItem('piepe-entered','1');localStorage.setItem('piepe-forest-sound','off')});const page=await context.newPage();await page.bringToFront()
  try{
   await page.goto(origin+(locale==='lv'?'/':'/en/'));await expect(page.locator('.world')).toHaveAttribute('data-version',phase==='before'?productionVersion!:releaseVersion);await page.evaluate(()=>document.fonts.ready);await expect(page.locator('.fungus-annotation')).toHaveCSS('opacity','1');await info.attach(`${phase}-${locale}-${width}-hero`,{body:await page.screenshot({type:'jpeg',quality:90,scale:'css'}),contentType:'image/jpeg'})
   const gateways=page.locator('.exploration-gateways');await gateways.evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-24,behavior:'instant'}));for(const image of await gateways.locator('img').all())await expect.poll(()=>image.evaluate((i:HTMLImageElement)=>i.naturalWidth)).toBeGreaterThan(0);await info.attach(`${phase}-${locale}-${width}-dividers`,{body:await page.screenshot({type:'jpeg',quality:90,scale:'css'}),contentType:'image/jpeg'})
   await page.goto(origin+readingPath(locale));await page.evaluate(()=>document.fonts.ready);await info.attach(`${phase}-${locale}-${width}-reading-header`,{body:await page.screenshot({type:'jpeg',quality:90,scale:'css'}),contentType:'image/jpeg'})
   if(phase==='after'){await page.goto(origin+wallpapersPath(locale));for(const design of wallpaperDesigns){const section=page.locator('#'+design.id);for(const image of await section.locator('img').all()){await image.scrollIntoViewIfNeeded();await expect.poll(()=>image.evaluate((i:HTMLImageElement)=>i.naturalWidth)).toBeGreaterThan(0)}await section.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await info.attach(`after-${locale}-${width}-${design.id}`,{body:await page.screenshot({type:'jpeg',quality:90,scale:'css'}),contentType:'image/jpeg'});if(width<700){await section.locator('article').nth(1).evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await info.attach(`after-${locale}-${width}-${design.id}-phone`,{body:await page.screenshot({type:'jpeg',quality:90,scale:'css'}),contentType:'image/jpeg'})}}}
  }finally{await context.close()}
 }
})
