import {portalCopy} from '../src/portalCopy'
import {test,expect} from '@playwright/test'
import {createHash} from 'node:crypto'
import {readFile} from 'node:fs/promises'
import {messages,readingPath,localePath} from '../src/i18n'
import {notePath} from '../src/forestPaths'
import {experienceCopy} from '../src/experienceCopy'
import {readings} from '../src/reading'
import {nativeDiagnostics} from './nativeDiagnostics'
nativeDiagnostics()

for(const locale of ['lv','en'] as const){
  for(const width of [390,800,1440])test.describe(`${locale} homepage viewport ${width}`,()=>{
    // A resized iPhone context remains a coarse-pointer, 3x device. Use actual
    // desktop input/render settings for desktop layouts, not a 4320px phone surface.
    test.use({viewport:{width,height:width===390?844:900},screen:{width,height:width===390?844:900},isMobile:width===390,hasTouch:width===390,deviceScaleFactor:width===390?3:1})
    test(`2.5.8.1 ${locale} ${width}: first viewport foreshadows Encounter; preserved X-Ray reveal retains native history`,async({page},info)=>{
    const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message))
    await page.addInitScript(()=>{sessionStorage.setItem('piepe-entered','1');localStorage.setItem('piepe-forest-sound','off')})
    await page.goto(localePath(locale));await expect(page.locator('.world')).not.toHaveClass(/prerendered/)
    expect(await page.evaluate(()=>innerWidth)).toBe(width)
    expect(await page.evaluate(()=>devicePixelRatio)).toBe(width===390?3:1)
    expect(await page.evaluate(()=>matchMedia('(pointer:coarse)').matches)).toBe(width===390)
    const entry=page.locator('.discovery-entry');await expect(entry).toBeVisible();await expect(entry).toContainText(portalCopy[locale].teaserHint)
    await expect.poll(()=>entry.locator('img').evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true)
    const b=(await entry.boundingBox())!;expect(b.y).toBeGreaterThan(0);expect(b.y+b.height).toBeLessThanOrEqual(width===390?844:900)
    const overlaps=await entry.evaluate(e=>{const a=e.getBoundingClientRect();return [...document.querySelectorAll('.hero-copy,.fungus-annotation>span:last-child,.world>.sound-control,.scroll-cue')].some(n=>{const b=n.getBoundingClientRect();return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top})});expect(overlaps).toBe(false)
    await info.attach(`${locale}-${width}-home`,{body:await page.screenshot({scale:'css'}),contentType:'image/png'})
    await entry.click();await expect(page).toHaveURL(/#encounter$/);await expect(page.locator('[data-portal-entry]')).toBeVisible();await expect(page.locator('.fungus-portal')).toHaveCount(0);await page.goBack();await page.goto(localePath(locale)+'#forest-xray')
    if(width>=700){const a=(await page.locator('.home-experiences').boundingBox())!,rail=(await page.locator('.journey-index').boundingBox())!;expect(a.x+a.width).toBeLessThan(rail.x-16)}
    const section=page.locator('#forest-xray'),range=section.locator('[data-xray-range]');await section.locator('.xray-view').scrollIntoViewIfNeeded();await expect(range).toBeEnabled();await expect(section.locator('[data-xray-controls]')).toBeVisible()
    await range.focus();await range.press('Home');await expect(range).toHaveValue('0');const hashes=[]
    // Assert actual painted states at their CSS pixel size. The iPhone project's 3x scale
    // otherwise makes a 1440px layout capture a synthetic 4320px bitmap three times.
    for(const key of ['Home','ArrowRight','End']){await range.press(key);hashes.push(createHash('sha256').update(await section.locator('.xray-view').screenshot({scale:'css'})).digest('hex'))}
    expect(new Set(hashes).size).toBe(3);await expect(range).toHaveAttribute('aria-valuetext',`100% ${experienceCopy[locale].xray.output}`)
    const selectedFrom=await page.evaluate(()=>({url:location.href,y:scrollY}));await section.locator('[data-xray-point="hyphae"]').click();expect(page.url()).toBe(selectedFrom.url);expect(await page.evaluate(()=>scrollY)).toBe(selectedFrom.y);await expect(section.locator('#home-xray-hyphae')).toBeVisible();await expect(section.getByRole('tabpanel')).toHaveCount(1)
    await expect(section.locator('[data-xray-point="hyphae"]')).toBeFocused()
    // Enhanced selection no longer adds an unwanted history entry.
    await page.goBack();await expect(page).toHaveURL(new RegExp(locale==='lv'?'/$':'/en/$'))
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
    await expect(page.locator('.exploration-guide')).toHaveAttribute('href',readingPath(locale)+'#beneath-bark')
    await expect(page.locator('.exploration-gateways a').first()).toHaveAttribute('href',readingPath(locale)+'#surface-atlas');await expect(page.locator('.exploration-gateways a').last()).toHaveAttribute('href',notePath(locale,'005')+'#deadwood-time')
    // Locale changes remount and bind a fresh controller rather than retaining stale IDs/listeners.
    await page.locator(`.site-header a[lang=${locale==='lv'?'en':'lv'}]`).click();const next=page.locator('#forest-xray [data-xray-range]');await next.scrollIntoViewIfNeeded();await expect(next).toBeEnabled();await next.focus();await next.press('Home');await expect(next).toHaveValue('0');await next.press('End');await expect(next).toHaveValue('100');expect(errors).toEqual([])
  })
  })
  test(`2.5.8.1 ${locale}: intro reserves the invitation, skip retains original focus, replay and full film remain intact`,async({page})=>{
    test.setTimeout(30000);await page.addInitScript(()=>localStorage.setItem('piepe-forest-sound','off'));await page.goto(localePath(locale))
    await expect(page.locator('video.forest-film')).toHaveCount(1);await expect(page.locator('.discovery-entry')).toBeHidden()
    await page.getByRole('button',{name:messages[locale].skipIntro,exact:true}).click();await expect(page.getByRole('button',{name:messages[locale].closer,exact:true})).toBeFocused();await expect(page.locator('.discovery-entry')).toBeVisible()
    await page.getByRole('button',{name:messages[locale].replayLabel,exact:true}).click();await expect(page.locator('.discovery-entry')).toBeHidden()
    await expect(page.locator('.world')).toHaveAttribute('data-exit-reason','ended',{timeout:16000});await expect(page.locator('.discovery-entry')).toBeVisible();await expect(page.locator('video.forest-film')).toHaveCount(0)
  })
  test(`2.5.8.1 ${locale}: homepage entry and explanations remain genuine HTML without JavaScript`,async({browser})=>{
    const c=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}})
    try{const p=await c.newPage();await p.goto(localePath(locale));await expect(p.locator('.discovery-entry')).toBeVisible();await p.locator('.discovery-entry').click();await expect(p).toHaveURL(/#encounter$/);await p.goto(localePath(locale)+'#forest-xray');await expect(p.locator('[data-xray-range]')).toBeDisabled();await expect(p.locator('[data-atmosphere-controls]')).toHaveCount(0);await p.locator('[data-xray-point=wood]').click();await expect(p).toHaveURL(/#home-xray-wood$/);await expect(p.locator('#home-xray-wood')).toContainText(experienceCopy[locale].xray.stories[0].text);await p.locator('.exploration-guide').click();await expect(p).toHaveURL(new RegExp(readingPath(locale)+'#beneath-bark$'));expect(c.pages()).toHaveLength(1);await expect(p.locator('.world,video')).toHaveCount(0)}finally{await c.close()}
  })
  test(`3.1.1 ${locale}: delayed static binding keeps native content stable without an obsolete preference header`,async({page})=>{
    let release!:()=>void;const gate=new Promise<void>(r=>{release=r})
    await page.route('**/reading-tools-*.js',async route=>{await gate;await route.continue()})
    await page.goto(notePath(locale,'005'),{waitUntil:'commit'});await expect(page.locator('h1')).toBeVisible()
    // WebKit's FontFaceSet.ready can wait for the deliberately blocked deferred
    // module. Load the two actual reading faces without deadlocking that gate.
    await page.evaluate(()=>Promise.all([document.fonts.load('400 48px "Cormorant Garamond"'),document.fonts.load('400 16px Manrope')]))
    await expect(page.locator('[data-time-controls]')).toBeVisible();await expect(page.locator('[data-time-range]')).toBeDisabled();await expect(page.locator('[data-atmosphere-controls]')).toHaveCount(0);const y=await page.locator('h1').evaluate(e=>e.getBoundingClientRect().top)
    release();await expect(page.locator('[data-time-range]')).toBeEnabled();expect(await page.locator('h1').evaluate(e=>e.getBoundingClientRect().top)).toBeCloseTo(y,0)
    await page.locator('[data-time-choice="3"]').click();await expect(page.locator('[data-time-capsule]')).toHaveAttribute('data-stage','3');const r=await page.locator('.time-visual').boundingBox();expect(r!.width/r!.height).toBeCloseTo(16/9,2)
    await page.goto(readingPath(locale));await expect(page.locator('[data-atmosphere-controls]')).toHaveCount(0);await expect(page.locator('body')).toHaveCSS('background-color','rgb(23, 32, 23)');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  })
}
for(const mode of ['reduced','save-data'] as const)test(`2.5.8.1 ${mode}: immediate home entry, usable reveal and static film alternative`,async({page})=>{
  if(mode==='reduced')await page.emulateMedia({reducedMotion:'reduce'});else await page.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true},configurable:true}))
  await page.goto('/en/');await expect(page.locator('.world')).not.toHaveClass(/prerendered/);await expect(page.locator('.discovery-entry')).toBeVisible();await expect(page.locator('video')).toHaveCount(0);await page.locator('.discovery-entry').click();await expect(page).toHaveURL(/#encounter$/);await page.goto('/en/#forest-xray');await page.locator('.xray-view').scrollIntoViewIfNeeded();await expect(page.locator('[data-xray-range]')).toBeEnabled();await page.locator('[data-xray-range]').focus();await page.keyboard.press('End');await expect(page.locator('[data-xray-range]')).toHaveValue('100');await expect(page.locator('.xray-cutaway')).toHaveCSS('transition-duration','0s')
})
test('2.5.8.1 original source/media checksums, real preview assets and lightweight independent reading module',async({request})=>{
  const fixture=JSON.parse(await readFile('docs/qa/v2581/baseline-inventory.json','utf8'))
  // 3.1 changes only Discovery's native download anchor to SiteLink; normalize
  // that reviewed wrapper while still pinning every camera/film/security source.
  // The independent progressive image/readiness tools now occupy 15.5KB (18KB cap).
  // 3.0 adds explicit portal-only audio activation; retain the historical fixture
  // and pin the reviewed audio change alongside functional opt-in/mute tests.
  const portalSources=JSON.parse(await readFile('docs/qa/v300/preserved-sources.json','utf8'))
  fixture.protectedSources['src/useForestAudio.ts']=portalSources['src/useForestAudio.ts']
  // 3.1.1 intentionally changes caption styles, download headers and snippet-only
  // markup. Pin those reviewed files and storage retirement separately; all camera/audio/media/Worker
  // and routing fixtures remain byte-for-byte protected by the original ledger.
  const headers=await readFile('public/_headers','utf8')
  expect(createHash('sha256').update(headers.split('/wallpapers/piepe-forest-desktop-5120x2880.jpg')[0]).digest('hex')).toBe(fixture.protectedSources['public/_headers'])
  const visualSources=JSON.parse(await readFile('docs/qa/v311/reviewed-sources.json','utf8'))
  expect(Object.keys(visualSources).sort()).toEqual(['public/_headers','public/boot.js','src/Discovery.tsx','src/style.css'])
  for(const [path,hash]of Object.entries({...fixture.originalAssets,...fixture.protectedSources,...visualSources}))expect(createHash('sha256').update(await readFile(path)).digest('hex'),path).toBe(hash)

  const home=await(await request.get('/')).text(),guide=await(await request.get(readingPath('lv'))).text(),entry=/src="(\/assets\/reading-tools-[^"]+\.js)"/.exec(guide)![1],js=await readFile('dist'+entry,'utf8')
  expect(js).not.toMatch(/react|gsap|ScrollTrigger|forest-reveal|AudioContext|import\s/);expect(Buffer.byteLength(js)).toBeLessThan(18000)
  const app=await readFile('dist'+/src="(\/assets\/[^"]+\.js)"/.exec(home)![1],'utf8');expect(app).not.toContain(readings.lv.sections[1].paragraphs[0]);expect(app).toContain(experienceCopy.lv.xray.stories[0].text)
  // Rejected schematic-art derivatives were intentionally removed in 2.5.8.2.
  for(const name of ['atlas-pores','atlas-gills','atlas-smooth','deadwood-stage-01','deadwood-stage-02','deadwood-stage-03','deadwood-stage-04','xray-bark-surface','xray-wood-mycelium'])expect((await request.get('/images/interactive/'+name+'.jpg')).status()).toBe(200)
})
