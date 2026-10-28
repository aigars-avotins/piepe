import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export function useForestMotion(root: RefObject<HTMLDivElement | null>, enabled: boolean, simple: boolean, onCinema?: (name: 'understory' | 'breathing', active: boolean) => void, onPrepare?: (name: 'understory' | 'breathing') => void) {
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    if (!enabled || failed) return
    const context = gsap.context(() => {}, root)
    let camera: gsap.core.Timeline | undefined
    const eligible = { understory: false, breathing: false }
    const startSettledCinema = () => {
      if (camera?.scrollTrigger?.getTween()?.isActive()) return
      for (const name of ['understory', 'breathing'] as const) if (eligible[name]) onCinema?.(name, true)
    }
    const stage = (name: 'understory' | 'breathing', active: boolean) => {
      eligible[name] = active
      if (!active) onCinema?.(name, false)
      else startSettledCinema()
    }
    try { context.add(() => {
      const media = gsap.matchMedia()
      media.add({ mobile: '(max-width: 699px)', desktop: '(min-width: 700px)' }, match => {
        const mobile = !!match.conditions?.mobile
        const timeline = gsap.timeline({ scrollTrigger: { trigger: '.world', start: 'top top', endTrigger: '#return', end: 'bottom bottom', scrub: simple ? .3 : .75, invalidateOnRefresh: true, onScrubComplete: startSettledCinema } })
        camera = timeline
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
          .to('.wide-environment', { opacity: 1, duration: 1, ease: 'power2.out' }, 2.65)
          .to('.wide-environment', { scale: 1, duration: 1.15, ease: 'power2.out' }, 2.65)
          .to('.dark-veil', { opacity: .16, duration: 1.1 }, 2.7)
          .to('.cool-veil', { opacity: 0, duration: .9 }, 2.85)
          .to('.dawn-light', { opacity: .34, xPercent: -12, duration: 1.2 }, 2.65)
          .to('.light-shaft', { opacity: .13, xPercent: -10, duration: 1 }, 2.9)
        return () => timeline.kill()
      })
      const prepareMacro = ScrollTrigger.create({ trigger: '#understory', start: 'top 135%', once: true, onEnter: () => onPrepare?.('understory') })
      const prepareBreathing = ScrollTrigger.create({ trigger: '#return', start: 'top 135%', once: true, onEnter: () => onPrepare?.('breathing') })
      const enterMacro = gsap.timeline({ scrollTrigger: { trigger: '#understory', start: 'top 90%', end: 'top 20%', scrub: true } })
        .fromTo('.understory-cinema', { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, ease: 'none', duration: 1 }, 0)
        .fromTo('.foreground-carrier', { opacity: 1 }, { opacity: 0, ease: 'none', duration: 1 }, 0)
      const leaveMacro = gsap.timeline({ scrollTrigger: { trigger: '#encounter', start: 'top 95%', end: 'top 25%', scrub: true } })
        .to('.understory-cinema', { opacity: 0, ease: 'none', immediateRender: false, duration: 1 }, 0)
        .to('.foreground-carrier', { opacity: 1, ease: 'none', immediateRender: false, duration: 1 }, 0)
      const macro = ScrollTrigger.create({ trigger: '#understory', start: 'top 90%', end: 'bottom 20%', onToggle: trigger => stage('understory', trigger.isActive) })
      const breathing = ScrollTrigger.create({ trigger: '#return', start: 'top 70%', end: 'bottom 0%', onToggle: trigger => stage('breathing', trigger.isActive) })
      return () => { media.revert(); prepareMacro.kill(); prepareBreathing.kill(); enterMacro.kill(); leaveMacro.kill(); macro.kill(); breathing.kill() }
    }) } catch {
      context.revert()
      const recover = requestAnimationFrame(() => setFailed(true))
      return () => cancelAnimationFrame(recover)
    }
    let active = true
    document.fonts.ready.then(() => { if (active) ScrollTrigger.refresh() })
    return () => { active = false; context.revert() }
  }, [root, enabled, simple, failed, onCinema, onPrepare])
  return failed
}
