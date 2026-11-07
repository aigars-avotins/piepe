import {test,expect} from '@playwright/test'
import {readFile,readdir} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {readingPath} from '../src/i18n'
import {forestPages,forestPath,notePath} from '../src/forestPaths'
import {nativeDiagnostics} from './nativeDiagnostics'
nativeDiagnostics()

const routes=['/','/en/',readingPath('lv'),readingPath('en'),...forestPages.flatMap(p=>[forestPath('lv',p),forestPath('en',p)])]
test('2.5.8.2 all 20 prerendered documents obey the link law, retain SEO, and contain no rejected art or scale',async({page,request},info)=>{
 const evidence=[]
 for(const path of routes){
  const html=await readFile('dist'+(path==='/'?'/':path)+'index.html','utf8'),result=await page.evaluate(markup=>{
   const doc=new DOMParser().parseFromString(markup,'text/html'),links=[...doc.querySelectorAll<HTMLAnchorElement>('a[href]')]
   const violations=links.filter(a=>{const exempt=a.getAttribute('href')!.startsWith('#')||!!a.closest('.reading-languages,.language-switch')||a.matches('header .brand');return exempt?(a.hasAttribute('target')||a.hasAttribute('rel')):a.target!=='_blank'||a.rel!=='noopener noreferrer'}).map(a=>a.outerHTML)
   return{links:links.length,violations,svgs:doc.querySelectorAll('#beneath-bark svg,#surface-atlas svg,#deadwood-time svg,#forest-xray svg').length,hidden:doc.querySelectorAll('[data-atmosphere-controls][hidden],[data-time-controls][hidden]').length,scale:doc.querySelectorAll('.journey-perspective,[data-scale-scene]').length,canonical:doc.querySelector('link[rel=canonical]')?.getAttribute('href'),schema:[...doc.querySelectorAll('script[type="application/ld+json"]')].map(s=>JSON.parse(s.textContent!)),ids:[...doc.querySelectorAll('[id]')].map(e=>e.id)}
  },html)
  expect(result.violations,path).toEqual([]);expect(result.svgs,path).toBe(0);expect(result.hidden,path).toBe(0);expect(result.scale,path).toBe(0);expect(result.ids.length).toBe(new Set(result.ids).size);expect(result.canonical).toBe('https://pie.pe'+path);expect(result.schema).toHaveLength(1)
  expect(html).not.toMatch(/Skatiena mērogs|Scale Journey|mycelium-drawing|deadwood-drawing|surface-drawing/)
  expect((await request.get(path)).status()).toBe(200);evidence.push({path,links:result.links,violations:0,svgs:0,hidden:0,scale:0})
 }
 await info.attach('all-routes-link-and-art-audit',{body:JSON.stringify(evidence,null,2),contentType:'application/json'})
})

for(const locale of ['lv','en'] as const){
 test(`2.5.8.2 ${locale}: image-wide dragging clips the aligned photos and hotspots highlight the factual card`,async({page})=>{
  await page.goto(readingPath(locale));const view=page.locator('.xray-view'),range=page.locator('[data-xray-range]');await view.scrollIntoViewIfNeeded()
  await expect.poll(()=>view.locator('img').evaluateAll(images=>images.every(e=>(e as HTMLImageElement).naturalWidth===2752))).toBe(true)
  const b=(await view.boundingBox())!;expect(b.width/b.height).toBeCloseTo(16/9,1)
  // Start far from the central divider: the whole image must be draggable.
  await page.mouse.move(b.x+b.width*.18,b.y+b.height*.66);await page.mouse.down();await page.mouse.move(b.x+b.width*.82,b.y+b.height*.66,{steps:9});await page.mouse.up();expect(Number(await range.inputValue())).toBeCloseTo(82,0)
  await range.focus();await range.press('Home');expect(await page.locator('.xray-cutaway').evaluate(e=>getComputedStyle(e).clipPath)).toContain('100%')
  await range.press('End');expect(await page.locator('.xray-cutaway').evaluate(e=>getComputedStyle(e).clipPath)).toMatch(/inset\(0px 0% 0px 0px\)/)
  await page.locator('[data-xray-point=wood]').click();await expect(page.locator('#xray-wood')).toHaveAttribute('data-current','');expect(await page.locator('#xray-wood').evaluate(e=>e===document.activeElement||e.contains(document.activeElement))).toBe(true)
 })
 test(`2.5.8.2 ${locale}: 140px loupe magnifies actual coordinates at 2.5x and comparison restores focus`,async({page})=>{
  await page.goto(readingPath(locale));const picture=page.locator('.atlas-picture').first();await picture.scrollIntoViewIfNeeded();const image=picture.locator('img[data-interactive-image]');await expect.poll(()=>image.evaluate((e:HTMLImageElement)=>e.naturalWidth)).toBe(2400)
  const b=(await image.boundingBox())!,x=b.width*.65,y=b.height*.6;const mouseX=Math.round(b.x+x),mouseY=Math.round(b.y+y);await page.mouse.move(mouseX,mouseY)
  const lens=picture.locator('.atlas-loupe');await expect(lens).toBeVisible();await expect(lens).toHaveCSS('width','140px')
  const zoom=await lens.locator('img').evaluate((e:HTMLImageElement)=>({width:parseFloat(e.style.width),height:parseFloat(e.style.height),left:parseFloat(e.style.left),top:parseFloat(e.style.top),source:e.currentSrc}))
  expect(zoom.width).toBeCloseTo(b.width*2.5,1);expect(zoom.height).toBeCloseTo(b.height*2.5,1);expect(zoom.left).toBeCloseTo(70-(mouseX-b.x)*2.5,0);expect(zoom.top).toBeCloseTo(70-(mouseY-b.y)*2.5,0);expect(zoom.source).toContain('atlas-pores.jpg')
  await picture.click();const dialog=page.locator('[data-atlas-dialog]');await expect(dialog).toBeVisible();await expect(dialog.locator('img')).toHaveCount(3);expect(await dialog.evaluate(e=>e.matches(':modal'))).toBe(true)
  await page.keyboard.press('Escape');await expect(dialog).toBeHidden();await expect(page.locator('[data-atlas-open]').first()).toBeFocused()
 })
 test(`2.5.8.2 ${locale}: continuous timeline blends adjacent original images without a dark gap or duplicate captions`,async({page})=>{
  await page.goto(notePath(locale,'005'));const range=page.locator('[data-time-range]');await range.scrollIntoViewIfNeeded()
  await range.evaluate((e:HTMLInputElement)=>{e.value='50';e.dispatchEvent(new Event('input',{bubbles:true}))})
  await expect(page.locator('[data-time-figure="1"]')).toHaveCSS('opacity','1');await expect(page.locator('[data-time-figure="2"]')).toHaveCSS('opacity','0.5');await expect(page.locator('[data-time-figure="3"]')).toHaveCSS('opacity','0')
  const captions=page.locator('[data-time-caption][aria-hidden=false]');await expect(captions).toHaveCount(1);await expect(captions).toHaveCSS('opacity','1')
  await range.focus();await range.press('ArrowRight');await expect(range).toHaveValue('50.1')
  await page.locator('[data-time-choice="3"]').click();await expect(range).toHaveValue('100');await expect(page.locator('[data-time-figure="3"]')).toHaveCSS('opacity','1');await expect(page.locator('[data-time-caption="3"]')).toBeVisible()
 })
}

test('2.5.8.2 missing JPG tries WebP, then the labelled wallpaper fallback; no retry loop',async({page})=>{
 const counts:Record<string,number>={}
 await page.route('**/images/interactive/xray-*',route=>{const url=new URL(route.request().url());counts[url.pathname]=(counts[url.pathname]||0)+1;return route.fulfill({status:404,body:''})})
 await page.goto('/kas-ir-piepe/#beneath-bark');const view=page.locator('.xray-view');await view.scrollIntoViewIfNeeded()
 await expect.poll(()=>view.locator('img').evaluateAll(es=>es.every(e=>(e as HTMLImageElement).naturalWidth===800&&e.getAttribute('src')==='/wallpapers/previews/desktop.webp'))).toBe(true)
 await expect(view.locator('.raster-fallback')).toBeVisible();expect(Object.keys(counts)).toHaveLength(4);expect(Object.values(counts)).toEqual([1,1,1,1])
})
test('2.5.8.2 WebP-only local assets decode without using the final fallback',async({page})=>{
 await page.route('**/images/interactive/atlas-pores.jpg',route=>route.fulfill({status:404,body:''}))
 // Exercise a genuine RIFF/WebP file, not a JPEG served with a WebP filename.
 await page.route('**/images/interactive/atlas-pores.webp',route=>route.fulfill({status:200,contentType:'image/webp',path:'public/wallpapers/previews/desktop.webp'}))
 await page.goto('/kas-ir-piepe/#surface-atlas');const picture=page.locator('.atlas-picture').first();await picture.scrollIntoViewIfNeeded();await expect.poll(()=>picture.locator('img[data-interactive-image]').evaluate((e:HTMLImageElement)=>e.naturalWidth)).toBe(800);await expect(picture.locator('img[data-interactive-image]')).toHaveAttribute('data-image-state','alternate');await expect(picture.locator('img[data-interactive-image]')).toHaveAttribute('src',/\.webp$/);await expect(picture.locator('.raster-fallback')).toBeHidden()
})
test('2.5.8.2 original JPEG pixels are retained with correct extensions; original cinema and routing stay unchanged',async()=>{
 const manifest=JSON.parse(await readFile('docs/qa/v2582/assets.json','utf8'))
 expect((await readdir('public/images/interactive')).filter(n=>/\.(?:jpg|webp)$/.test(n))).toHaveLength(9)
 for(const asset of manifest){const bytes=await readFile('public'+asset.url);expect(bytes[0]).toBe(0xff);expect(bytes[1]).toBe(0xd8);expect(createHash('sha256').update(bytes).digest('hex')).toBe(asset.sha256)}
})

for(const locale of ['lv','en'] as const)test(`2.5.8.2 ${locale}: narrow-phone HUD never covers the fungus invitation or another control`,async({browser})=>{
 const context=await browser.newContext({viewport:{width:320,height:668},isMobile:true,hasTouch:true})
 try{
  const page=await context.newPage();await page.addInitScript(()=>{sessionStorage.setItem('piepe-entered','1');localStorage.setItem('piepe-forest-sound','off')})
  await page.goto(locale==='lv'?'/':'/en/');await expect(page.locator('.world')).not.toHaveClass(/prerendered/);await page.evaluate(()=>document.fonts.ready)
  const selectors=['.hero-copy','.discovery-entry','.hero-foot .scroll-cue','.hero-atmosphere','.world>.sound-control','.fungus-annotation>span:last-child']
  const overlaps=await page.evaluate(selectors=>{const boxes=selectors.map(s=>({s,r:document.querySelector(s)!.getBoundingClientRect()})),overlaps:string[][]=[];for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];if(a.r.left<b.r.right&&a.r.right>b.r.left&&a.r.top<b.r.bottom&&a.r.bottom>b.r.top)overlaps.push([a.s,b.s])}return overlaps},selectors)
  expect(overlaps).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(320)
  await page.locator('[data-atmosphere-choice=nightfall]').click();await expect(page.locator('html')).toHaveAttribute('data-atmosphere','nightfall')
  expect(await page.locator('.world>main').evaluate(e=>Number(getComputedStyle(e).zIndex))).toBeGreaterThan(await page.locator('.world').evaluate(e=>Number(getComputedStyle(e,'::after').zIndex)))
 }finally{await context.close()}
})

test('2.5.8.2 mood changes the entire reading palette and grades the visual plane once',async({page})=>{
 await page.goto('/kas-ir-piepe/');const grade=page.locator('.xray-images'),morning=await grade.evaluate(e=>getComputedStyle(e).filter)
 expect(morning).toBe('brightness(1.08) saturate(1.14) sepia(0.08) contrast(1) hue-rotate(0deg)')
 await page.locator('[data-atmosphere-choice=nightfall]').click()
 await expect(grade).toHaveCSS('filter','brightness(0.82) saturate(0.75) sepia(0) contrast(1.12) hue-rotate(-18deg)')
 await expect(page.locator('body')).toHaveCSS('background-color','rgb(5, 8, 13)');await expect(grade.locator('img').first()).toHaveCSS('filter','none')
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-atmosphere-choice=morning]').click();await expect(grade).toHaveCSS('transition-duration','0s')
 await expect(page.locator('body')).toHaveCSS('background-color','rgb(23, 32, 23)')
})


test('2.5.8.2 mood optical grade interpolates across actual rendered frames',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'})
 await page.goto('/kas-ir-piepe/#beneath-bark');await page.locator('.xray-view').scrollIntoViewIfNeeded()
 const samples=await page.evaluate(async()=>{
  const element=document.querySelector('.xray-images')!,startFilter=getComputedStyle(element).filter,frames:{time:number;filter:string}[]=[]
  document.querySelector<HTMLButtonElement>('[data-atmosphere-choice=nightfall]')!.click()
  const start=performance.now();await new Promise<void>(resolve=>{const frame=()=>{const time=performance.now()-start;frames.push({time,filter:getComputedStyle(element).filter});if(time<750)requestAnimationFrame(frame);else resolve()};requestAnimationFrame(frame)})
  return{startFilter,frames}
 })
 const end='brightness(0.82) saturate(0.75) sepia(0) contrast(1.12) hue-rotate(-18deg)'
 expect(samples.frames.at(-1)!.filter).toBe(end)
 const intermediate=samples.frames.filter(frame=>frame.time<600&&frame.filter!==samples.startFilter&&frame.filter!==end)
 expect(intermediate.length,'The visible optical grade must interpolate, not cut instantly').toBeGreaterThan(2)
 expect(new Set(intermediate.map(frame=>frame.filter)).size).toBeGreaterThan(2)
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.xray-images')).toHaveCSS('transition-duration','0s')
})
