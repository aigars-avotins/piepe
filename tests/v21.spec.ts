import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { messages } from '../src/i18n'
import type { Locale } from '../src/i18n'

for (const locale of ['lv', 'en'] as const) {
  const path = locale === 'lv' ? '/' : '/en/'
  test(`${locale}: raw HTML, facts, metadata, reciprocal alternates and strict 404`, async ({ request, browser }) => {
    const response = await request.get(path); expect(response.status()).toBe(200)
    const html = await response.text()
    expect(html).toContain(`<html lang="${locale}"`)
    expect(html).toContain(messages[locale].factsTitle)
    expect(html).toContain(messages[locale].facts[0].text)
    expect(html).toContain(`rel="canonical" href="https://pie.pe${path}"`)
    expect(html).toContain('hrefLang="lv"') // React static HTML uses the valid case-insensitive attribute.
    expect(html).toContain('https://pie.pe/en/')
    const data = JSON.parse(/<script type="application\/ld\+json">(.*?)<\/script>/.exec(html)![1])
    expect(data.inLanguage).toBe(locale); expect(data['@type']).toBe('WebPage')
    expect((await request.get('/this-page-does-not-exist')).status()).toBe(404)
    expect((await request.get('/source/forest-reveal-original.mp4')).status()).toBe(404)
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage(); await page.goto(response.url())
    await expect(page.getByRole('heading', { name: messages[locale].factsTitle })).toBeVisible()
    await expect(page.getByRole('link', { name: messages[locale].download5k })).toHaveAttribute('download', '')
    await context.close()
  })
  test(`${locale}: localized field note and wallpaper files are real downloads`, async ({ page, request }) => {
    const t = messages[locale]
    await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto(path)
    const videoRequests: string[] = []; page.on('request', r => { if (r.url().endsWith('.mp4')) videoRequests.push(r.url()) })
    await page.getByRole('button', { name: t.closer, exact: true }).click()
    await page.getByRole('tab', { name: t.observations[0].label, exact: false }).press('End')
    const download = page.waitForEvent('download'); await page.getByRole('link', { name: t.keepNote, exact: false }).click()
    expect((await download).suggestedFilename()).toBe(`piepe-field-note-001-${locale}.txt`)
    await expect(page.getByRole('status')).toContainText(t.collected)
    await page.getByRole('button', { name: t.closeDiscovery }).click()
    await expect(page.getByRole('button', { name: t.closer, exact: true })).toBeFocused()
    const note = await request.get(`/field-note-${locale}.txt`); expect(note.status()).toBe(200); expect(await note.text()).toContain(t.observations[0].text)
    const wallpaper = page.waitForEvent('download'); await page.getByRole('link', { name: t.download5k }).click()
    expect((await wallpaper).suggestedFilename()).toBe('piepe-forest-desktop-5120x2880.jpg')
    await expect(page.getByRole('status')).toContainText(t.saveHint)
    expect(videoRequests).toEqual([])
    for (const [file, width, height] of [['desktop-5120x2880', 5120, 2880], ['desktop-3840x2160', 3840, 2160], ['mobile-1440x3120', 1440, 3120]] as const) {
      const url = `/wallpapers/piepe-forest-${file}.jpg`
      const res = await request.get(url); expect(res.status()).toBe(200); expect(res.headers()['content-type']).toContain('image/jpeg')
      await page.evaluate(async ({ url, width, height }) => { const img = new Image(); img.src = url; await img.decode(); if (img.naturalWidth !== width || img.naturalHeight !== height) throw Error('Wrong wallpaper dimensions') }, { url, width, height })
    }
  })
}

test('language links preserve active intro, open discovery, observation, collection and scroll; back works', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('navigation', { name: 'Valoda' }).getByRole('link', { name: 'EN' }).click()
  await expect(page).toHaveURL(/\/en\/$/); await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.getByRole('button', { name: 'Skip intro' }).click()
  await page.getByRole('button', { name: 'Look closer at the fungus', exact: true }).click()
  const skip = page.getByRole('button', { name: 'Go straight to the field note' }); if (await skip.isVisible()) await skip.click()
  await page.getByRole('tab', { name: /Surface/ }).press('End')
  await page.getByRole('dialog').getByRole('link', { name: 'LV', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible(); await expect(page.getByRole('tab', { name: /Tālāk/ })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('heading', { name: /Paņem līdzi/ })).toBeVisible()
  await page.getByRole('button', { name: 'Aizvērt piepes stāstu' }).click()
  await page.locator('#fungus-facts').scrollIntoViewIfNeeded(); const y = await page.evaluate(() => scrollY)
  await page.evaluate(() => (document.querySelector('.site-header .language-switch a[lang="en"]') as HTMLElement).click())
  expect(Math.abs(await page.evaluate(() => scrollY) - y)).toBeLessThan(5)
  await page.goBack(); await expect(page.locator('html')).toHaveAttribute('lang', 'lv')
  await expect(page.locator('video.forest-film')).toHaveCount(0)
})

test('all cinematic shots play naturally once, hold the exact end still and never overlap decoders', async ({ page }) => {
  test.setTimeout(45000)
  await page.addInitScript(() => { sessionStorage.setItem('piepe-entered', '1'); (window as unknown as { maxPlaying: number }).maxPlaying = 0; setInterval(() => { const w = window as unknown as { maxPlaying: number }; w.maxPlaying = Math.max(w.maxPlaying, [...document.querySelectorAll('video')].filter(v => !v.paused && !v.ended).length) }, 50) })
  await page.addInitScript(() => {
    const frames: { name: string; difference: number }[] = []; (window as unknown as { clipFrames: typeof frames }).clipFrames = frames
    document.addEventListener('ended', event => {
      const video = event.target as HTMLVideoElement; const stage = video.closest('.motion-clip'); const image = stage?.querySelector('.clip-end') as HTMLImageElement
      if (!image?.complete) return
      const canvas = document.createElement('canvas'); canvas.width = 192; canvas.height = 108; const ctx = canvas.getContext('2d')!
      ctx.drawImage(video,0,0,192,108); const a = ctx.getImageData(0,0,192,108).data; ctx.drawImage(image,0,0,192,108); const b = ctx.getImageData(0,0,192,108).data
      let sum = 0; for(let i=0;i<a.length;i++) if(i%4!==3) sum+=Math.abs(a[i]-b[i]); frames.push({ name: stage!.getAttribute('data-clip')!, difference: sum/(192*108*3) })
    }, true)
  })
  await page.goto('/en/')
  await page.getByRole('button', { name: 'Look closer at the fungus', exact: true }).click()
  await expect(page.locator('video[src$="awakening.mp4"]')).toBeVisible()
  await expect.poll(() => page.locator('video[src$="awakening.mp4"]').evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(.1)
  await expect(page.getByRole('heading', { name: /A small shelf/ })).toBeVisible({ timeout: 11000 })
  await page.getByRole('button', { name: 'Close discovery' }).click()
  for (const [section, clip] of [['understory', 'understory'], ['return', 'breathing']] as const) {
    await page.locator('#' + section).scrollIntoViewIfNeeded()
    const layer = page.locator(`[data-clip="${clip}"]`)
    await expect(layer).toBeVisible(); await expect(layer).toHaveAttribute('data-clip-state', 'complete', { timeout: 11000 })
    await expect(layer).toHaveAttribute('data-clip-reason', 'ended')
    await expect(layer.locator('video')).toHaveCount(0)
    await expect(layer.locator('img')).toHaveAttribute('src', `/media/forest-${clip}-final.jpg`)
    expect(await layer.locator('img').evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth === 1920)).toBe(true)
  }
  await page.locator('#understory').scrollIntoViewIfNeeded(); await expect(page.locator('video')).toHaveCount(0)
  expect(await page.evaluate(() => (window as unknown as { maxPlaying: number }).maxPlaying)).toBe(1)
  const frames = await page.evaluate(() => (window as unknown as { clipFrames: { name: string; difference: number }[] }).clipFrames)
  expect(frames.map(f => f.name)).toEqual(['awakening', 'understory', 'breathing'])
  for (const frame of frames) expect(frame.difference).toBeLessThan(10)
})

for (const scenario of ['blocked', 'missing', 'stall', 'pending'] as const) test(`awakening ${scenario} recovers to the complete accessible note`, async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('piepe-entered', '1'))
  if (scenario === 'blocked') await page.addInitScript(() => { HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('Blocked', 'NotAllowedError')) })
  if (scenario === 'missing') await page.route('**/media/forest-awakening.mp4', route => route.abort())
  if (scenario === 'pending') await page.route('**/media/forest-awakening.mp4', () => {})
  await page.goto('/en/'); await page.getByRole('button', { name: 'Look closer at the fungus', exact: true }).click()
  if (scenario === 'stall') { await expect.poll(() => page.locator('video').evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(.1); await page.locator('video').evaluate((v: HTMLVideoElement) => v.pause()) }
  await expect(page.getByRole('heading', { name: /A small shelf/ })).toBeVisible({ timeout: 11000 })
  await page.keyboard.press('Escape'); await expect(page.getByRole('button', { name: 'Look closer at the fungus', exact: true })).toBeFocused()
})

test('both locales fit the complete required viewport matrix', async ({ page }, testInfo) => {
  test.setTimeout(45000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const locale of ['lv', 'en'] as Locale[]) {
    await page.goto(locale === 'lv' ? '/' : '/en/')
    for (const [width, height] of [[1440,900],[1512,982],[390,844],[390,664],[320,690],[430,932],[844,390],[2560,1080]]) {
      await page.setViewportSize({ width, height }); await page.evaluate(() => { scrollTo({top:0,behavior:'instant'}); return document.fonts.ready })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      const overlap = await page.evaluate(() => { const hero = document.querySelector('.hero-copy')!.getBoundingClientRect(); const plane = document.querySelector('.hero-hotspot-plane')!.getBoundingClientRect(); return hero.bottom <= plane.top + plane.height * .358 })
      if (width < 700) expect(overlap).toBe(true)
      await page.screenshot({ path: testInfo.outputPath(`${locale}-${width}x${height}.png`), scale: 'css' })
      await page.getByRole('button', { name: messages[locale].closer, exact: true }).click()
      await expect(page.getByRole('dialog')).toBeVisible()
      const close = await page.getByRole('button', { name: messages[locale].closeDiscovery }).boundingBox()
      expect(close!.height).toBeGreaterThanOrEqual(44); expect(close!.y).toBeGreaterThanOrEqual(0)
      await page.getByRole('button', { name: messages[locale].closeDiscovery }).click()
    }
  }
})

test('assets, sitemap, CSP and dictionary parity', async ({ request }) => {
  const keys = (value: unknown, prefix = ''): string[] => value && typeof value === 'object' ? Object.entries(value).flatMap(([key, item]) => keys(item, `${prefix}.${key}`)) : [prefix]
  expect(keys(messages.lv)).toEqual(keys(messages.en))
  for (const file of ['/favicon.svg', '/favicon.ico', '/apple-touch-icon.png', '/icon-192.png', '/icon-512.png', '/site.webmanifest', '/social-preview.jpg']) expect((await request.get(file)).status()).toBe(200)
  const ico = await (await request.get('/favicon.ico')).body(); expect([...ico.subarray(0,4)]).toEqual([0,0,1,0]); expect(ico.readUInt16LE(4)).toBeGreaterThanOrEqual(3)
  const sitemap = await (await request.get('/sitemap.xml')).text(); expect(sitemap).toContain('<loc>https://pie.pe/en/</loc>'); expect(sitemap).toContain('<loc>https://pie.pe/</loc>')
  expect(await (await request.get('/robots.txt')).text()).toContain('https://pie.pe/sitemap.xml')
  const headers = await readFile('dist/_headers', 'utf8'); expect(headers).toContain("script-src 'self' 'sha256-"); expect(headers).toContain('object-src \'none\'')
})

test('storage denial still permits localized interaction and explicit replay', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.getItem = () => { throw new DOMException('Unavailable', 'SecurityError') }; Storage.prototype.setItem = () => { throw new DOMException('Unavailable', 'SecurityError') } })
  await page.goto('/'); await page.getByRole('button', { name: 'Izlaist ievadu' }).click()
  await page.getByRole('button', { name: 'Aplūkot piepi tuvāk', exact: true }).click()
  await page.getByRole('button', { name: 'Uzreiz atvērt meža piezīmi' }).click()
  await page.keyboard.press('Escape'); await expect(page.getByRole('button', { name: 'Aplūkot piepi tuvāk', exact: true })).toBeFocused()
  await page.getByRole('button', { name: 'Aplūkot piepi tuvāk', exact: true }).click(); await expect(page.locator('.awakening-stage')).toHaveCount(0); await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Atkārtot ievadfilmu' }).click(); await expect(page.locator('video.forest-film')).toHaveCount(1)
})

test('save-data bypasses all automatic films and never fetches full wallpapers on arrival', async ({ page }) => {
  const requests: string[] = []; page.on('request', r => requests.push(r.url()))
  await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true }, configurable: true }))
  await page.goto('/')
  expect(requests.filter(r => /\.mp4$|wallpapers\/piepe-.*\.jpg(?:\?|$)/.test(r))).toEqual([])
  for (const id of ['understory', 'return']) { await page.locator('#' + id).scrollIntoViewIfNeeded(); await expect(page.locator('video')).toHaveCount(0) }
  expect(requests.filter(r => r.endsWith('.mp4'))).toEqual([])
})

test('scene video covers phones, MacBook and ultrawide without stretching or side borders', async ({ page }) => {
  // Each viewport is a fresh playback visit. Preparation now reads history before scrolling.
  await page.addInitScript(() => { sessionStorage.setItem('piepe-entered','1'); sessionStorage.removeItem('piepe-understory') })
  const video = page.locator('video[src$="understory.mp4"]')
  for (const [width,height] of [[1440,900],[1512,982],[390,844],[390,664],[320,690],[430,932],[844,390],[2560,1080]]) {
    await page.setViewportSize({width,height}); await page.goto('/en/'); await page.locator('#understory').scrollIntoViewIfNeeded(); await expect(video).toBeVisible(); await expect(video).toHaveCSS('object-fit','cover')
    const visible = await page.evaluate(() => ({ width: innerWidth, height: innerHeight }))
    const box = await video.boundingBox(); expect(box!.width).toBeGreaterThanOrEqual(visible.width); expect(box!.height).toBeGreaterThanOrEqual(visible.height)
  }
})

test('missing awakening still recovers to the preserved forest photo', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.route('**/media/forest-awakening-final.jpg', route => route.abort())
  await page.goto('/en/'); await page.getByRole('button',{name:'Look closer at the fungus',exact:true}).click()
  const photo=page.locator('.specimen-photo img')
  await expect(photo).toHaveAttribute('src','/media/forest-final.jpg')
  expect(await photo.evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth===1920)).toBe(true)
  await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Look closer at the fungus',exact:true})).toBeFocused()
})
