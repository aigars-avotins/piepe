import { test, expect } from '@playwright/test'
test.afterEach(async({page},testInfo)=>{ const events=await page.evaluate(()=>(window as unknown as {filmEvents?:unknown[]}).filmEvents).catch(()=>undefined); if(events) await testInfo.attach('film-events',{body:JSON.stringify(events),contentType:'application/json'}) })

test('actual film plays once, reveals title, ends and becomes interactive', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
    const events: unknown[]=[]; (window as unknown as {filmEvents:unknown[]}).filmEvents=events
    for(const name of ['play','playing','pause','waiting','stalled','error','ended','timeupdate']) document.addEventListener(name,e=>{if(e.target instanceof HTMLVideoElement)events.push({event:name,time:e.target.currentTime,paused:e.target.paused,ready:e.target.readyState,error:e.target.error?.message,at:performance.now()})},true)
  })
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Skip intro' })).toBeVisible()
  const film = page.locator('video')
  await expect.poll(() => film.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0.1)
  const metadata = await film.evaluate((v: HTMLVideoElement) => ({ duration: v.duration, width: v.videoWidth, height: v.videoHeight, muted: v.muted, inline: v.playsInline, loop: v.loop }))
  expect(metadata.duration).toBeGreaterThan(5.8)
  expect(metadata.duration).toBeLessThan(6.3)
  expect(metadata).toMatchObject({ width: 1920, height: 1080, muted: true, inline: true, loop: false })
  await expect(page.locator('.world')).toHaveAttribute('data-exit-reason', 'ended', { timeout: 11000 })
  await expect(film).toHaveCount(0)
  await page.getByRole('button', { name: 'Discover the shelf fungus' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('heading', { name: /A small shelf/ })).toBeVisible()
  await page.getByRole('button', { name: 'Close discovery' }).click()
  await page.locator('#encounter').scrollIntoViewIfNeeded()
  await expect(page.getByRole('button', { name: 'Open the field note', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Return to forest' }).click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5)
  await expect(page).toHaveURL(/#forest$/)
  await expect(page.locator('#forest')).toBeFocused()
  await expect(film).toHaveCount(0)
  await expect(page.locator('.world')).toHaveAttribute('data-exit-reason', 'ended')
  expect(errors).toEqual([])
})

test('skip is immediate and fungus works with keyboard and Escape', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Skip intro' }).click()
  const fungus = page.getByRole('button', { name: 'Look closer at the fungus', exact: true })
  await expect(fungus).toBeEnabled()
  await expect(fungus).toBeFocused()
  await fungus.press('Enter')
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Close discovery' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(fungus).toBeFocused()
  await page.reload()
  await expect(page.locator('video')).toHaveCount(0)
})

test('reduced motion avoids downloading film, remains readable and has no overflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const films: string[] = []
  page.on('request', request => { if (request.url().endsWith('.mp4')) films.push(request.url()) })
  await page.goto('/')
  await expect(page.locator('video')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'pie.pe', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Discover the shelf fungus' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Close discovery' }).click()
  for (const id of ['forest', 'understory', 'encounter', 'return']) {
    await page.locator('#' + id).scrollIntoViewIfNeeded()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await expect(page.getByRole('heading', { name: 'Same forest. Another way of seeing.' })).toBeVisible()
  expect(films).toEqual([])
})

test('blocked autoplay falls back immediately to the interactive still', async ({ page }) => {
  await page.addInitScript(() => { HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('Blocked', 'NotAllowedError')) })
  await page.goto('/')
  await expect(page.locator('.world')).toHaveAttribute('data-exit-reason', 'autoplay-blocked')
  await expect(page.getByRole('button', { name: 'Discover the shelf fungus' })).toBeEnabled()
})

test('missing video recovers without trapping the visitor', async ({ page }) => {
  await page.route('**/media/forest-reveal.mp4', route => route.abort())
  await page.goto('/')
  await expect(page.locator('.world')).toHaveAttribute('data-intro-state', 'complete', { timeout: 6000 })
  await page.getByRole('button', { name: 'Look closer at the fungus', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('pending playback and a mid-film stall both have bounded recovery', async ({ page }) => {
  await page.route('**/media/forest-reveal.mp4', () => {})
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.world')).toHaveAttribute('data-exit-reason', 'load-timeout', { timeout: 6000 })
  await expect(page.getByRole('button', { name: 'Discover the shelf fungus' })).toBeEnabled()
})

test('an actual decoding stall recovers to the still', async ({ page }) => {
  await page.goto('/')
  await expect.poll(() => page.locator('video').evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0.25)
  await page.locator('video').evaluate((v: HTMLVideoElement) => v.pause())
  await expect(page.locator('.world')).toHaveAttribute('data-exit-reason', 'stalled', { timeout: 5000 })
})

test('missing still retains accessible text and controls', async ({ page }) => {
  await page.route('**/media/forest-final.jpg', route => route.abort())
  await page.goto('/')
  await expect(page.locator('.world')).toHaveAttribute('data-intro-state', 'complete')
  await expect(page.locator('.media-note')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'pie.pe', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Look closer at the fungus', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('data saving preference avoids video request', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true }, configurable: true }))
  await page.goto('/')
  await expect(page.locator('video')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Discover the shelf fungus' })).toBeEnabled()
})

test('cover geometry keeps hotspot aligned to the actual fungus across viewport changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (const size of [{ width: 390, height: 844 }, { width: 320, height: 690 }, { width: 844, height: 390 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(size)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await expect.poll(async () => page.locator('.base-camera .media-plane').evaluate(e => Math.abs(e.getBoundingClientRect().width - 1920 * Math.max(innerWidth / 1920, innerHeight / 1080)))).toBeLessThan(1)
    const geometry = await page.evaluate(() => {
      const image = document.querySelector('.media-plane')!.getBoundingClientRect()
      const hit = document.querySelector('.fungus-hit')!.getBoundingClientRect()
      return { dx: Math.abs(hit.x + hit.width / 2 - (image.x + image.width * .665)), dy: Math.abs(hit.y + hit.height / 2 - (image.y + image.height * .598)), hitX: hit.x + hit.width / 2, hitY: hit.y + hit.height / 2, overflow: document.documentElement.scrollWidth > innerWidth }
    })
    expect(geometry.dx).toBeLessThan(1)
    expect(geometry.dy).toBeLessThan(1)
    expect(geometry.hitX).toBeGreaterThan(0)
    expect(geometry.hitX).toBeLessThan(size.width)
    expect(geometry.hitY).toBeLessThan(size.height)
    expect(geometry.overflow).toBe(false)
  }
})


test('discovery is a complete three-step field note with a real downloadable artifact', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/')
  await page.getByRole('button', { name: 'Look closer at the fungus', exact: true }).click()
  await page.getByRole('tab', { name: /Surface/ }).press('ArrowRight')
  await expect(page.getByRole('tab', { name: /Beneath/ })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('heading', { name: /The visible part/ })).toBeVisible()
  await page.getByRole('button', { name: 'Look beyond', exact: true }).click()
  await expect(page.getByRole('heading', { name: /Take a different/ })).toBeVisible()
  const download = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Keep the field note', exact: false }).click()
  expect((await download).suggestedFilename()).toBe('piepe-field-note-001.txt')
  await expect(page.getByRole('status')).toContainText('Field note collected')
  await page.getByRole('button', { name: 'Close discovery' }).click()
  await expect(page.getByRole('button', { name: 'Look closer at the fungus', exact: true })).toBeFocused()
  await page.reload(); await expect(page.locator('.encounter-status')).toContainText('Collected')
})

test('returning visitors can explicitly replay the original introduction without scroll replay', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('piepe-entered', '1'))
  await page.goto('/'); await expect(page.locator('video')).toHaveCount(0)
  await page.getByRole('button', { name: 'Replay introduction' }).click()
  await expect(page.locator('video')).toHaveCount(1)
  await expect.poll(() => page.locator('video').evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(.1)
  await page.getByRole('button', { name: 'Skip intro' }).click()
  await expect(page.locator('.world')).toHaveAttribute('data-exit-reason', 'skipped')
  await page.locator('#return').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: 'Return to forest', exact: true }).click()
  await expect(page.locator('video')).toHaveCount(0)
})

test('visible wordmark and discovery controls fit all specified portrait and landscape sizes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/')
  for (const size of [{width:320,height:690},{width:360,height:780},{width:390,height:844},{width:430,height:932},{width:844,height:390}]) {
    await page.setViewportSize(size); await page.evaluate(() => scrollTo({top:0,behavior:'instant'}))
    await page.evaluate(() => document.fonts.ready)
    const boxes = await page.locator('.wordmark span').evaluateAll(elements => elements.map(e => { const r=e.getBoundingClientRect(); return {left:r.left,right:r.right} }))
    for (const box of boxes) { expect(box.left).toBeGreaterThanOrEqual(0); expect(box.right).toBeLessThanOrEqual(size.width) }
    expect(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth)).toBe(true)
    const target = await page.getByRole('button', {name:'Look closer at the fungus',exact:true}).boundingBox()
    expect(target!.height).toBeGreaterThanOrEqual(44)
  }
})

test('scroll changes photographic camera, foreground and return lighting rather than only text', async ({page}) => {
  await page.addInitScript(() => sessionStorage.setItem('piepe-entered','1')); await page.goto('/')
  const states=[]
  for(const id of ['forest','understory','encounter','return']) {
    await page.evaluate(id => {const e=document.getElementById(id)!;scrollTo({top:e.offsetTop+innerHeight*.2,behavior:'instant'})},id)
    await page.waitForTimeout(1000)
    states.push(await page.locator('.base-camera').getAttribute('style'))
  }
  expect(new Set(states).size).toBeGreaterThanOrEqual(3)
  await expect(page.locator('.wide-environment')).toHaveCSS('opacity','1')
})

test('animation setup failure leaves a readable interactive static journey', async ({page}) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('piepe-entered','1')
    const native = matchMedia.bind(window)
    window.matchMedia = query => { if (query.includes('max-width: 699px')) throw new Error('Animation unavailable'); return native(query) }
  })
  await page.goto('/')
  await expect(page.locator('.world')).toHaveClass(/motion-off/)
  await page.getByRole('button',{name:'Look closer at the fungus',exact:true}).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button',{name:'Close discovery'}).click()
  await page.locator('#return').scrollIntoViewIfNeeded()
  await expect(page.getByRole('button',{name:'Return to forest',exact:true})).toBeVisible()
})

test('mobile discovery keeps close available at the bottom and supports touch-sized controls', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'})
  for (const size of [{width:320,height:690},{width:390,height:844},{width:844,height:390}]) {
    await page.setViewportSize(size); await page.goto('/')
    await page.getByRole('button',{name:'Look closer at the fungus',exact:true}).click()
    await page.getByRole('button',{name:'Look beneath',exact:true}).click()
    await page.getByRole('button',{name:'Look beyond',exact:true}).click()
    await page.getByRole('link',{name:'Keep the field note',exact:false}).scrollIntoViewIfNeeded()
    const close=await page.getByRole('button',{name:'Close discovery'}).boundingBox()
    expect(close!.y).toBeGreaterThanOrEqual(0)
    expect(close!.y+close!.height).toBeLessThanOrEqual(size.height)
    expect(close!.height).toBeGreaterThanOrEqual(44)
    await page.getByRole('button',{name:'Close discovery'}).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  }
})

test('pause and changing motion preference clean up the camera while retaining navigation',async({page})=>{
  await page.addInitScript(()=>sessionStorage.setItem('piepe-entered','1'));await page.goto('/')
  await page.locator('#return').scrollIntoViewIfNeeded()
  await page.getByRole('button',{name:'Pause atmosphere'}).click()
  await expect(page.locator('.world')).toHaveClass(/motion-off/)
  await page.getByRole('button',{name:'Resume atmosphere'}).click()
  await expect(page.locator('.world')).not.toHaveClass(/motion-off/)
  await page.emulateMedia({reducedMotion:'reduce'})
  await expect(page.locator('.world')).toHaveClass(/motion-off/)
  await page.getByRole('button',{name:'Return to forest',exact:true}).click()
  await expect(page.locator('#forest')).toBeFocused()
})
