import { test, expect } from '@playwright/test'

for (const locale of ['lv', 'en']) test(`${locale}: encounter plus, readable support copy and safe source links`, async ({ page, context }) => {
  await page.addInitScript(() => sessionStorage.setItem('piepe-entered', '1'))
  await page.goto(locale === 'lv' ? '/' : '/en/')
  await expect(page.locator('.wallpaper-quality')).toHaveCount(0)
  expect(await page.locator('.encounter-copy .chapter-body').evaluate(e => parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(16)
  expect(await page.locator('.encounter-status').evaluate(e => parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(13)
  await page.locator('.specimen-invitation').scrollIntoViewIfNeeded()
  await page.locator('.specimen-invitation').click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('.specimen-invitation')).toBeFocused()
  for (const link of await page.locator('.fact-sources a').all()) {
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  }
  await context.route('https://www.woodlandtrust.org.uk/**', route => route.fulfill({ contentType: 'text/html', body: '<p>Source navigation QA</p>' }))
  const url = page.url(), popup = context.waitForEvent('page')
  await page.getByRole('link', { name: 'Woodland Trust' }).click()
  const source = await popup; await source.waitForLoadState('domcontentloaded')
  expect(await source.evaluate(() => window.opener === null)).toBe(true)
  expect(page.url()).toBe(url)
  await source.close()
})

test('macro is prepared behind the existing bark before its scroll envelope, and waits for actual media', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('piepe-entered', '1'))
  let release!: () => void
  const gate = new Promise<void>(resolve => { release = resolve })
  await page.route(/forest-understory(?:\.jpg|\.mp4|-final\.jpg)(?:\?.*)?$/, async route => { await gate; await route.continue() })
  await page.goto('/en/', { waitUntil: 'domcontentloaded' })
  const clip = page.locator('[data-clip=understory]')
  await expect(clip).toHaveCount(1)
  await expect(clip.locator('video')).toHaveCount(0)
  await expect(page.locator('.understory-cinema')).toHaveCSS('opacity', '0')
  await page.evaluate(() => scrollTo({ top: document.getElementById('understory')!.offsetTop - innerHeight * .55, behavior: 'instant' }))
  await expect(clip.locator('video')).toHaveCount(1)
  await expect(clip).toHaveCSS('opacity', '0')
  expect(await page.locator('.foreground-camera').evaluate(e => Number(getComputedStyle(e).zIndex))).toBeGreaterThan(await page.locator('.understory-cinema').evaluate(e => Number(getComputedStyle(e).zIndex)))
  release()
  await expect(clip).toHaveAttribute('data-clip-ready', 'true')
  await expect(clip).toHaveCSS('opacity', '1')
  await expect(page.locator('dialog[open]')).toHaveCount(0)
})

test('sound waits for permission, plays a real native loop, remains controllable in the note and remembers mute', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('piepe-entered', '1')
    let allowed = false
    // Touch browsers may grant audio activation only on the completed click, after pointerdown.
    document.addEventListener('click', () => { allowed = true }, true)
    document.addEventListener('keydown', () => { allowed = true }, true)
    const Native = window.AudioContext
    window.AudioContext = class extends Native {
      constructor(options?: AudioContextOptions) { super(options); (window as unknown as { audioQA: AudioContext }).audioQA = this }
      resume() { return allowed ? super.resume() : Promise.reject(new DOMException('Autoplay blocked for QA', 'NotAllowedError')) }
      createBufferSource() { const source = super.createBufferSource(); (window as unknown as { sourceQA: AudioBufferSourceNode }).sourceQA = source; return source }
    }
  })
  const requests: string[] = []
  page.on('request', r => { if (r.url().endsWith('forest-ambience.mp3')) requests.push(r.url()) })
  await page.goto('/')
  await page.waitForFunction(() => !document.querySelector('.world')!.classList.contains('prerendered'))
  await expect(page.locator('.world>.sound-control')).toHaveAttribute('data-audio-state', 'waiting')
  expect(requests).toEqual([])
  await page.getByRole('navigation', { name: 'Valoda' }).getByRole('link', { name: 'EN' }).click()
  await expect(page.getByRole('button', { name: 'Mute forest sound' })).toHaveAttribute('data-audio-state', 'playing', { timeout: 10000 })
  const graph = await page.evaluate(() => { const w = window as unknown as { audioQA: AudioContext; sourceQA: AudioBufferSourceNode }; return { state: w.audioQA.state, loop: w.sourceQA.loop, duration: w.sourceQA.buffer!.duration } })
  expect(graph.state).toBe('running'); expect(graph.loop).toBe(true); expect(graph.duration).toBeGreaterThan(59)
  await page.getByRole('button', { name: 'Look closer at the fungus', exact: true }).click()
  await page.getByRole('button', { name: 'Go straight to the field note' }).click()
  const mute = page.getByRole('dialog').getByRole('button', { name: 'Mute forest sound' })
  await expect(mute).toBeVisible(); await mute.click()
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Enable forest sound' })).toHaveAttribute('aria-pressed', 'false')
  await expect.poll(() => page.evaluate(() => (window as unknown as { audioQA: AudioContext }).audioQA.state)).toBe('suspended')
  expect(requests.length).toBe(1)
  requests.length = 0
  await page.reload()
  await expect(page.getByRole('button', { name: 'Enable forest sound' })).toHaveAttribute('data-audio-state', 'muted')
  expect(requests).toEqual([])
})

test('save-data never starts automatic ambience, and a missing recording has a usable retry', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true }, configurable: true }))
  const requests: string[] = []; page.on('request', r => { if (r.url().endsWith('.mp3')) requests.push(r.url()) })
  await page.route('**/forest-ambience.mp3', route => route.abort())
  await page.goto('/en/')
  await expect(page.getByRole('button', { name: 'Enable forest sound' })).toHaveAttribute('data-audio-state', 'muted')
  expect(requests).toEqual([])
  await page.getByRole('button', { name: 'Enable forest sound' }).click()
  await expect(page.getByRole('button', { name: 'Enable forest sound' })).toHaveAttribute('data-audio-state', 'unavailable')
  await page.unroute('**/forest-ambience.mp3')
  await page.getByRole('button', { name: 'Enable forest sound' }).click()
  await expect(page.getByRole('button', { name: 'Mute forest sound' })).toHaveAttribute('data-audio-state', 'playing', { timeout: 10000 })
})
