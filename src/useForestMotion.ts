import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export function useForestMotion(root: RefObject<HTMLDivElement | null>, enabled: boolean, simple: boolean) {
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    if (!enabled || failed) return
    const context = gsap.context(() => {}, root)
    try { context.add(() => {
      const media = gsap.matchMedia()
      media.add({ mobile: '(max-width: 699px)', desktop: '(min-width: 700px)' }, match => {
        const mobile = !!match.conditions?.mobile
        const timeline = gsap.timeline({ scrollTrigger: { trigger: '.world', start: 'top top', end: 'bottom bottom', scrub: simple ? .3 : .75, invalidateOnRefresh: true } })
        timeline.to('.base-camera', { scale: mobile ? 1.55 : 1.95, xPercent: mobile ? 20 : 25, yPercent: 12, ease: 'power2.inOut', duration: 1.25 }, .25)
          .to('.foreground-camera', { opacity: simple ? .3 : 1, xPercent: -28, scale: 1.65, duration: 1.2, ease: 'power2.inOut' }, .3)
          .to('.cool-veil', { opacity: .64, duration: .8 }, .55)
          .to('.dark-veil', { opacity: .34, duration: .9 }, .6)
          .to('.light-shaft', { xPercent: 35, opacity: .02, duration: 1.1 }, .4)
          .to('.base-camera', { scale: mobile ? .94 : 1.12, xPercent: mobile ? -6 : 7, yPercent: mobile ? -17 : 0, duration: 1.2, ease: 'power2.inOut' }, 1.45)
          .to('.foreground-camera', { xPercent: -75, opacity: 0, duration: .9 }, 1.45)
          .to('.cool-veil', { opacity: .22, duration: .8 }, 1.6)
          .to('.dark-veil', { opacity: .32, duration: .8 }, 1.65)
          .to('.base-camera', { opacity: 0, scale: 1, xPercent: 0, yPercent: 0, duration: 1.1 }, 2.65)
          .to('.wide-environment', { opacity: 1, scale: 1, duration: 1.15, ease: 'power2.out' }, 2.65)
          .to('.dark-veil', { opacity: .16, duration: 1.1 }, 2.7)
          .to('.cool-veil', { opacity: 0, duration: .9 }, 2.85)
          .to('.dawn-light', { opacity: .34, xPercent: -12, duration: 1.2 }, 2.65)
          .to('.light-shaft', { opacity: .13, xPercent: -10, duration: 1 }, 2.9)
        return () => timeline.kill()
      })
      return () => media.revert()
    }) } catch {
      context.revert()
      const recover = requestAnimationFrame(() => setFailed(true))
      return () => cancelAnimationFrame(recover)
    }
    let active = true
    document.fonts.ready.then(() => { if (active) ScrollTrigger.refresh() })
    return () => { active = false; context.revert() }
  }, [root, enabled, simple, failed])
  return failed
}
