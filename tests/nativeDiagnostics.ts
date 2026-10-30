import { test, expect } from '@playwright/test'
import { execFileSync } from 'node:child_process'

const activateBrowser = `ObjC.import('AppKit');
const apps = $.NSWorkspace.sharedWorkspace.runningApplications.js;
const requested = [];
for (const app of apps) {
  const name = app.localizedName.js;
  if (/^(Playwright|MiniBrowser)$/.test(name)) requested.push({ name, activated: !!app.activateWithOptions(3) });
}
JSON.stringify({ requested, frontmost: $.NSWorkspace.sharedWorkspace.frontmostApplication.localizedName.js });`

/** Native-only evidence for compositor/input failures; no product instrumentation. */
export function nativeDiagnostics() {
  if (process.platform !== 'darwin') return
  test.beforeEach(async ({ page }, info) => {
    // DOM focus alone does not activate an AppKit application on a CI desktop.
    // Use the native workspace API, without System Events/Accessibility control.
    const activation = execFileSync('/usr/bin/osascript', ['-l', 'JavaScript', '-e', activateBrowser], { encoding: 'utf8' })
    await info.attach('native-window-activation', { body: activation, contentType: 'application/json' })
    await page.bringToFront()
    const requested = JSON.parse(activation).requested as { name: string }[]
    expect(requested.length, 'A native WebKit application must be running').toBeGreaterThan(0)
    await expect.poll(() => execFileSync('/usr/bin/osascript', ['-l', 'JavaScript', '-e', "ObjC.import('AppKit'); $.NSWorkspace.sharedWorkspace.frontmostApplication.localizedName.js"], { encoding: 'utf8' }).trim(), { timeout: 5000 }).toBe(requested[0].name)
    await page.addInitScript(() => {
      const events: unknown[] = [], photoPhases: unknown[] = [], state = { events, photoPhases, maxFrameGap: 0, frames: 0 }
      ;(window as unknown as { nativeEvidence: typeof state }).nativeEvidence = state
      let previous = performance.now()
      const frame = (now: number) => { state.maxFrameGap = Math.max(state.maxFrameGap, now - previous); state.frames++; previous = now; requestAnimationFrame(frame) }
      requestAnimationFrame(frame)
      // Observe lifecycle timing without layout reads or video surface copying.
      new MutationObserver(records => { for (const record of records) {
        const photo = record.target as HTMLElement
        photoPhases.push({ at: performance.now(), phase: photo.dataset.cameraPhase || 'settled', progress: photo.dataset.cameraProgress, dialogOpen: !!document.querySelector('dialog[open]') })
      } }).observe(document, { subtree: true, attributes: true, attributeFilter: ['data-camera-phase'] })
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
