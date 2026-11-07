import {test,expect} from '@playwright/test'
import {createHash} from 'node:crypto'
import {readFile} from 'node:fs/promises'
import {messages,readingPath,localePath} from '../src/i18n'
import {notePath} from '../src/forestPaths'
import {discoveryCopy} from '../src/discoveryCopy'
import {experienceCopy} from '../src/experienceCopy'
import {readings} from '../src/reading'
import {nativeDiagnostics} from './nativeDiagnostics'
nativeDiagnostics()

for(const locale of ['lv','en'] as const){
  for(const width of [390,800,1440])test(`2.5.8.1 ${locale} ${width}: first viewport entry reaches the working homepage reveal and native history`,async({page},info)=>{
    await page.setViewportSize({width,height:width===390?844:900})
    const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message))
    await page.addInitScript(()=>{sessionStorage.setItem('piepe-entered','1');localStorage.setItem('piepe-forest-sound','off')})
    await page.goto(localePath(locale));await expect(page.locator('.world')).not.toHaveClass(/prerendered/)
    const entry=page.locator('.discovery-entry');await expect(entry).toBeVisible();await expect(entry).toContainText(discoveryCopy[locale].title)
    await expect.poll(()=>entry.locator('img').evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true)
    const b=(await entry.boundingBox())!;expect(b.y).toBeGreaterThan(0);expect(b.y+b.height).toBeLessThanOrEqual(width===390?844:900)
    const overlaps=await entry.evaluate(e=>{const a=e.getBoundingClientRect();return [...document.querySelectorAll('.hero-copy,.fungus-annotation,.world>.sound-control,.scroll-cue')].some(n=>{const b=n.getBoundingClientRect();return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top})});expect(overlaps).toBe(false)
    await info.attach(`${locale}-${width}-home`,{body:await page.screenshot(),contentType:'image/png'})
    await entry.click();await expect(page).toHaveURL(/#forest-xray$/)
    if(width>1100){const a=(await page.locator('.home-experiences').boundingBox())!,rail=(await page.locator('.journey-perspective').boundingBox())!;expect(a.x+a.width).toBeLessThan(rail.x-16)}
    const section=page.locator('#forest-xray'),range=section.locator('[data-xray-range]');await expect(section.locator('[data-xray-controls]')).toBeVisible()
    await range.focus();await range.press('Home');await expect(range).toHaveValue('0');const hashes=[]
    for(const key of ['Home','ArrowRight','End']){await range.press(key);hashes.push(createHash('sha256').update(await section.locator('.xray-view').screenshot()).digest('hex'))}
    expect(new Set(hashes).size).toBe(3);await expect(range).toHaveAttribute('aria-valuetext',`100% ${experienceCopy[locale].xray.output}`)
    await section.locator('[data-xray-point="hyphae"]').click();await expect(page).toHaveURL(/#home-xray-hyphae$/);await expect(section.locator('#home-xray-hyphae')).toHaveAttribute('open','')
    expect(await section.locator('#home-xray-hyphae').evaluate(e=>e.contains(document.activeElement))).toBe(true)
    await page.goBack();await expect(page).toHaveURL(/#forest-xray$/);await page.goBack();await expect(page).toHaveURL(new RegExp(locale==='lv'?'/$':'/en/$'))
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
    await expect(page.locator('.exploration-guide')).toHaveAttribute('href',readingPath(locale)+'#beneath-bark')
    await expect(page.locator('.exploration-gateways a').first()).toHaveAttribute('href',readingPath(locale)+'#surface-atlas');await expect(page.locator('.exploration-gateways a').last()).toHaveAttribute('href',notePath(locale,'005')+'#deadwood-time')
    // Locale changes remount and bind a fresh controller rather than retaining stale IDs/listeners.
    await page.locator(`.site-header a[lang=${locale==='lv'?'en':'lv'}]`).click();const next=page.locator('#forest-xray [data-xray-range]');await next.focus();await next.press('Home');await expect(next).toHaveValue('0');await next.press('End');await expect(next).toHaveValue('100');expect(errors).toEqual([])
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
    try{const p=await c.newPage();await p.goto(localePath(locale));await expect(p.locator('.discovery-entry')).toBeVisible();await p.locator('.discovery-entry').click();await expect(p).toHaveURL(/#forest-xray$/);await expect(p.locator('[data-xray-controls]')).toBeHidden();await expect(p.locator('[data-atmosphere-controls]')).toBeHidden();await p.locator('#home-xray-wood summary').click();await expect(p.locator('#home-xray-wood')).toContainText(experienceCopy[locale].xray.stories[0].text);await p.locator('.exploration-guide').click();await expect(p).toHaveURL(new RegExp(readingPath(locale)+'#beneath-bark$'));await expect(p.locator('.world,video')).toHaveCount(0)}finally{await c.close()}
  })
  test(`2.5.8.1 ${locale}: delayed static code exposes controls only after binding, with header preference and stable layout`,async({page})=>{
    let release!:()=>void;const gate=new Promise<void>(r=>{release=r})
    await page.route('**/reading-tools-*.js',async route=>{await gate;await route.continue()})
    const nav=page.goto(notePath(locale,'005'),{waitUntil:'commit'});await nav
    await expect(page.locator('[data-time-controls]')).toBeHidden();await expect(page.locator('[data-atmosphere-controls]')).toBeHidden();const y=await page.locator('h1').evaluate(e=>e.getBoundingClientRect().top)
    release();await expect(page.locator('[data-time-controls]')).toBeVisible();await expect(page.locator('.reading-header [data-atmosphere-controls]')).toBeVisible();expect(await page.locator('h1').evaluate(e=>e.getBoundingClientRect().top)).toBeCloseTo(y,0)
    await page.locator('[data-time-choice="3"]').click();await expect(page.locator('[data-time-capsule]')).toHaveAttribute('data-stage','3');const r=await page.locator('.time-visual').boundingBox();expect(r!.width/r!.height).toBeCloseTo(16/9,2)
    const night=locale==='lv'?'Nakts krēsla':'Nightfall';await page.getByRole('button',{name:night,exact:true}).click();await page.goto(readingPath(locale));await expect(page.locator('html')).toHaveAttribute('data-atmosphere','nightfall');await expect(page.locator('.reading-header [data-atmosphere-controls]')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  })
}
for(const mode of ['reduced','save-data'] as const)test(`2.5.8.1 ${mode}: immediate home entry, usable reveal and static film alternative`,async({page})=>{
  if(mode==='reduced')await page.emulateMedia({reducedMotion:'reduce'});else await page.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true},configurable:true}))
  await page.goto('/en/');await expect(page.locator('.world')).not.toHaveClass(/prerendered/);await expect(page.locator('.discovery-entry')).toBeVisible();await expect(page.locator('video')).toHaveCount(0);await page.locator('.discovery-entry').click();await page.locator('[data-xray-range]').focus();await page.keyboard.press('End');await expect(page.locator('[data-xray-range]')).toHaveValue('100');await expect(page.locator('.hyphae-flow')).toHaveCSS('animation-name','none')
})
test('2.5.8.1 original source/media checksums, real preview assets and lightweight independent reading module',async({request})=>{
  const fixture=JSON.parse(await readFile('docs/qa/v2581/baseline-inventory.json','utf8'))
  for(const [path,hash]of Object.entries({...fixture.protectedSources,...fixture.originalAssets}))expect(createHash('sha256').update(await readFile(path)).digest('hex'),path).toBe(hash)
  const home=await(await request.get('/')).text(),guide=await(await request.get(readingPath('lv'))).text(),entry=/src="(\/assets\/reading-tools-[^"]+\.js)"/.exec(guide)![1],js=await readFile('dist'+entry,'utf8')
  expect(js).not.toMatch(/react|gsap|ScrollTrigger|forest-reveal|AudioContext|import\s/);expect(Buffer.byteLength(js)).toBeLessThan(9000)
  const app=await readFile('dist'+/src="(\/assets\/[^"]+\.js)"/.exec(home)![1],'utf8');expect(app).not.toContain(readings.lv.sections[1].paragraphs[0]);expect(app).toContain(experienceCopy.lv.xray.stories[0].text)
  for(const asset of JSON.parse(await readFile('docs/qa/v2581/derived-assets.json','utf8'))){expect(createHash('sha256').update(await readFile('public'+asset.url)).digest('hex')).toBe(asset.sha256);expect((await request.get(asset.url)).status()).toBe(200)}
})
