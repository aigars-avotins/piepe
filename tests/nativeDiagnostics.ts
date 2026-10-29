import { test } from '@playwright/test'

/** Native-only evidence for compositor/input failures; no product instrumentation. */
export function nativeDiagnostics() {
  if (process.platform !== 'darwin') return
  test.use({ video: 'on' })
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const events: unknown[] = [], state = { events, maxFrameGap: 0, frames: 0 }
      ;(window as unknown as { nativeEvidence: typeof state }).nativeEvidence = state
      let previous = performance.now()
      const frame = (now: number) => { state.maxFrameGap = Math.max(state.maxFrameGap, now - previous); state.frames++; previous = now; requestAnimationFrame(frame) }
      requestAnimationFrame(frame)
      for (const name of ['click', 'keydown', 'keyup', 'cancel', 'focusin', 'hashchange', 'visibilitychange', 'loadstart', 'loadedmetadata', 'loadeddata', 'playing', 'waiting', 'stalled', 'error']) {
        document.addEventListener(name, event => {
          const target = event.target
          if (events.length >= 250) events.shift()
          events.push({ event: name, at: performance.now(), scroll: scrollY, hash: location.hash, focus: document.hasFocus(), target: target instanceof Element ? target.tagName + '.' + target.getAttribute('class') : '', key: event instanceof KeyboardEvent ? event.key : undefined, media: target instanceof HTMLVideoElement ? { src: target.currentSrc, time: target.currentTime, ready: target.readyState, paused: target.paused } : undefined })
        }, true)
      }
    })
  })
  test.afterEach(async ({ page }, info) => {
    if (page.isClosed()) return
    const state = await page.evaluate(() => ({
      ...(window as unknown as { nativeEvidence?: object }).nativeEvidence,
      href: location.href, scroll: scrollY, focus: document.hasFocus(), visibility: document.visibilityState,
      viewport: { width: innerWidth, height: innerHeight }, screen: { width: screen.width, height: screen.height },
      world: document.querySelector('.world')?.className,
      photo: (document.querySelector('.specimen-photo') as HTMLElement | null)?.dataset,
      videos: [...document.querySelectorAll('video')].map(v => ({ src: v.currentSrc, time: v.currentTime, ready: v.readyState, paused: v.paused, frames: v.getVideoPlaybackQuality().totalVideoFrames }))
    }))
    await info.attach('native-input-and-compositor', { body: JSON.stringify(state), contentType: 'application/json' })
  })
}
