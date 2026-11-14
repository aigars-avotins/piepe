import {test, expect} from '@playwright/test'
import {readFile, readdir} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {portalCopy} from '../src/portalCopy'
import {threadCopy} from '../src/threadCopy'

const sizes = [[320,568],[756,491],[390,844],[430,932],[844,390],[800,900],[1440,900],[1512,982],[2048,1152]]
for (const locale of ['lv','en'] as const) for (const [width,height] of sizes) test.describe(`3.2 ${locale} ${width}x${height}`, () => {
  test.use({viewport:{width,height},screen:{width,height},isMobile:width<700||width===844,hasTouch:width<700||width===844,deviceScaleFactor:1})
  test('primary action and quiet thread are reachable, factual, reversible and request no films', async ({page}, info) => {
    await page.emulateMedia({reducedMotion:'reduce'})
    await page.addInitScript(() => {sessionStorage.setItem('piepe-entered','1');localStorage.setItem('piepe-forest-sound','off')})
    const films:string[]=[];page.on('request',r=>{if(/\.mp4(?:\?|$)/.test(r.url()))films.push(r.url())})
    await page.goto(locale==='lv'?'/':'/en/')
    await expect(page.locator('.world')).not.toHaveClass(/prerendered/)
    const entry=page.locator('[data-portal-hero-entry]')
    await expect(entry).toContainText(portalCopy[locale].entry)
    await expect(entry).toBeInViewport({ratio:1})
    await expect(entry).toHaveAttribute('href','#encounter')
    expect(await entry.getAttribute('target')).toBeNull()
    const overlap=await entry.evaluate(e=>{const a=e.getBoundingClientRect();return [...document.querySelectorAll('.hero-copy,.fungus-annotation>span:last-child,.world>.sound-control,.scroll-cue')].some(n=>{const b=n.getBoundingClientRect();return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top})})
    expect(overlap).toBe(false)
    await entry.click()
    const portal=page.locator('.fungus-portal'),t=portalCopy[locale],copy=threadCopy[locale]
    await expect(portal).toHaveAttribute('data-portal-still-presented','true')
    await portal.getByRole('button',{name:t.still,exact:true}).click()
    await expect(portal).toHaveAttribute('data-portal-static','true')
    await expect(page.locator('[data-living-thread]')).toHaveCount(0)
    await portal.locator('[data-thread-open]').click()
    await expect(portal).toHaveAttribute('data-portal-thread','true')
    await expect(portal.locator('[data-thread-light]')).toHaveCount(0)
    for(let i=0;i<3;i++) {
      await portal.locator('.thread-navigation button').nth(i).click()
      await expect(portal.locator('#thread-story')).toContainText(copy.stories[i].text)
      await expect(portal.locator('.thread-navigation button').nth(i)).toHaveAttribute('aria-pressed','true')
    }
    const geometry=await portal.locator('.portal-topbar,.living-thread,.portal-action-row,.portal-cinema-toggle,.portal-art,.portal-sound').evaluateAll(es=>es.map(e=>({name:e.className,box:e.getBoundingClientRect().toJSON()})))
    for(const r of geometry){expect(r.box.top,r.name).toBeGreaterThanOrEqual(0);expect(r.box.bottom,r.name).toBeLessThanOrEqual(height+1);expect(r.box.left,r.name).toBeGreaterThanOrEqual(0);expect(r.box.right,r.name).toBeLessThanOrEqual(width+1)}
    for(let i=0;i<geometry.length;i++)for(let j=i+1;j<geometry.length;j++){const a=geometry[i],b=geometry[j];expect(a.box.left<b.box.right&&a.box.right>b.box.left&&a.box.top<b.box.bottom&&a.box.bottom>b.box.top,`${a.name} overlaps ${b.name}`).toBe(false)}
    for(const button of await portal.locator('button:visible').all()) {const b=(await button.boundingBox())!;expect(b.height).toBeGreaterThanOrEqual(44);expect(b.y+b.height).toBeLessThanOrEqual(height+1)}
    await info.attach('quiet-thread',{body:await page.screenshot({scale:'css'}),contentType:'image/png'})
    await page.keyboard.press('Escape');await expect(portal.locator('[data-thread-open]')).toBeFocused()
    await portal.locator('[data-thread-open]').click();await portal.getByRole('button',{name:copy.close,exact:true}).click();await expect(portal.locator('[data-thread-open]')).toBeFocused()
    await portal.locator('[data-thread-open]').click();await page.goBack();await expect(portal).toHaveCount(0);await expect(entry).toBeFocused()
    expect(await page.evaluate(()=>scrollY)).toBe(0);expect(films).toEqual([])
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false)
  })
})

for(const locale of ['lv','en']as const)for(const [width,height]of[[390,844],[844,390],[1512,982]])test.describe(`3.2 moving ${locale} ${width}`,()=>{
  test.use({viewport:{width,height},screen:{width,height},isMobile:width<700||width===844,hasTouch:width<700||width===844,deviceScaleFactor:1})
  test('one input-driven light preserves advancing 1080p frames, keyboard, touch, pause, clean cinema and exact return',async({page,browserName},info)=>{
    test.skip(browserName==='webkit'&&process.platform==='linux','Linux WebKit cannot certify the original H.264 films; native macOS release validation covers moving media.')
    test.setTimeout(45000)
    await page.addInitScript(()=>{sessionStorage.setItem('piepe-entered','1');localStorage.setItem('piepe-forest-sound','off')})
    const portalRequests:string[]=[];page.on('request',r=>{if(/portal-\d+-faststart\.mp4/.test(r.url()))portalRequests.push(r.url())})
    await page.goto(locale==='lv'?'/':'/en/');await expect(page.locator('.world')).not.toHaveClass(/prerendered/);expect(portalRequests).toEqual([])
    await page.locator('[data-portal-hero-entry]').click();const portal=page.locator('.fungus-portal'),t=portalCopy[locale],copy=threadCopy[locale]
    await portal.getByRole('button',{name:t.begin,exact:true}).click();await portal.getByRole('button',{name:t.skip,exact:true}).click();await expect(portal).toHaveAttribute('data-portal-phase','living-world')
    const film=portal.locator('[data-portal-clip="3"] video'),view=portal.locator('[data-portal-view]')
    await expect.poll(()=>film.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThan(.3)
    const before=await film.evaluate((v:HTMLVideoElement)=>({time:v.currentTime,frames:v.getVideoPlaybackQuality().totalVideoFrames}))
    await portal.locator('[data-thread-open]').click();await expect(view).toBeFocused();await view.press('ArrowRight');const light=portal.locator('[data-thread-light]');await expect(light).toHaveCSS('opacity','1')
    const at=await light.evaluate(e=>e.style.transform);await view.press('ArrowLeft');await expect.poll(()=>light.evaluate(e=>e.style.transform)).not.toBe(at)
    await view.press('Enter');await expect(portal.locator('#thread-story')).toContainText(copy.stories[1].text);await view.press('Home');await expect(portal.locator('#thread-story')).toContainText(copy.stories[0].text)
    // Real PointerEvent routing exercises the same primary-touch handler without a drag/scroll trap.
    const touch=await view.boundingBox();await view.dispatchEvent('pointerdown',{pointerType:'touch',isPrimary:true,buttons:1,clientX:touch!.width*.25,clientY:touch!.height*.3});await expect(light).toHaveCSS('opacity','1');await view.dispatchEvent('pointerup',{pointerType:'touch',isPrimary:true,buttons:0});await expect(light).toHaveCSS('opacity','0')
    await expect.poll(()=>film.evaluate((v:HTMLVideoElement)=>v.getVideoPlaybackQuality().totalVideoFrames)).toBeGreaterThan(before.frames+8)
    expect(await film.evaluate((v:HTMLVideoElement)=>({width:v.videoWidth,height:v.videoHeight,rate:v.playbackRate,loop:v.loop}))).toEqual({width:1920,height:1080,rate:1,loop:true})
    expect(await portal.locator('video').evaluateAll(es=>es.filter(v=>!v.paused).length)).toBe(1)
    await info.attach('moving-thread',{body:await page.screenshot({scale:'css'}),contentType:'image/png'})
    await portal.getByRole('button',{name:t.pause,exact:true}).click();await expect(portal).toHaveAttribute('data-portal-paused','true');await expect(light).toHaveCount(0);await expect(portal.locator('[data-living-thread]')).toBeVisible();await portal.getByRole('button',{name:t.resume,exact:true}).click()
    await portal.locator('[data-cinema-toggle]').click();await expect(portal).toHaveAttribute('data-portal-clean','true');await expect(portal.locator('[data-living-thread]')).toHaveCount(0);await expect(portal.getByRole('button',{name:t.pause,exact:true})).toBeInViewport({ratio:1});await expect(portal.getByRole('button',{name:t.exit,exact:true})).toBeInViewport({ratio:1})
    await portal.locator('[data-cinema-toggle]').click();await portal.locator('[data-thread-open]').click();await page.keyboard.press('Escape');await expect(portal.locator('[data-thread-open]')).toBeFocused();await page.keyboard.press('Escape');await expect(portal).toHaveCount(0);await expect(page.locator('[data-portal-hero-entry]')).toBeFocused();expect(await page.evaluate(()=>scrollY)).toBe(0)
  })
})

test('3.2 no production media changes, codecs or new film payloads; player and security remain byte-identical',async()=>{
  const baseline=JSON.parse(await readFile('docs/qa/v320/preserved-assets.json','utf8'))
  for(const asset of baseline.assets)expect(createHash('sha256').update(await readFile(asset.path)).digest('hex'),asset.path).toBe(asset.sha256)
  const videos=(await readdir('public/media')).filter(name=>name.endsWith('.mp4')).sort()
  expect(videos).toEqual(baseline.assets.filter((a:{path:string})=>a.path.startsWith('public/media/')&&a.path.endsWith('.mp4')).map((a:{path:string})=>a.path.split('/').at(-1)).sort())
  for(const [path,hash]of Object.entries(baseline.protectedSources))expect(createHash('sha256').update(await readFile(path)).digest('hex'),path).toBe(hash)
})

for(const locale of ['lv','en']as const)test(`3.2 ${locale} Save-Data exploration adds no media requests and retains every text beat`,async({page})=>{
  await page.addInitScript(()=>{Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:true}});localStorage.setItem('piepe-forest-sound','off')})
  const films:string[]=[];page.on('request',r=>{if(/\.mp4(?:\?|$)/.test(r.url()))films.push(r.url())})
  await page.goto(locale==='lv'?'/':'/en/');await page.locator('[data-portal-hero-entry]').click();const portal=page.locator('.fungus-portal')
  await portal.getByRole('button',{name:portalCopy[locale].still,exact:true}).click();await expect(portal).toHaveAttribute('data-portal-static','true');await expect.poll(()=>portal.locator('.portal-static-world').evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth>0)).toBe(true)
  const requests:string[]=[];page.on('request',r=>requests.push(r.url()));await portal.locator('[data-thread-open]').click()
  for(let n=0;n<3;n++){await portal.locator('.thread-navigation button').nth(n).click();await expect(portal.locator('#thread-story')).toContainText(threadCopy[locale].stories[n].text)}
  expect(requests).toEqual([]);expect(films).toEqual([]);await page.keyboard.press('Escape');await expect(portal.locator('[data-thread-open]')).toBeFocused();await page.keyboard.press('Escape');await expect(portal).toHaveCount(0)
})

test('3.2 native no-JS hero link still reaches Encounter, and SSR prioritizes the opening photograph',async({browser,request})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}})
  try{const page=await context.newPage();for(const path of ['/','/en/']){await page.goto(path);await page.locator('[data-portal-hero-entry]').click();await expect(page).toHaveURL(/#encounter$/);await expect(page.locator('#encounter')).toBeInViewport();expect(await page.locator('[data-portal-hero-entry]').getAttribute('target')).toBeNull()}}finally{await context.close()}
  const html=await(await request.get('/')).text()
  expect(html).toMatch(/rel="preload"[^>]+href="\/media\/forest-poster.jpg\?v=2.3"/)
  expect(html).not.toMatch(/rel="preload"[^>]+href="\/media\/forest-(?:final|breathing-poster).jpg/)
})
