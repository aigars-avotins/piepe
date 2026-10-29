import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

/** Native sticky plateaus own the viewing time; ScrollTrigger directs only the entrances/exits. */
export function useForestMotion(root: RefObject<HTMLDivElement | null>, enabled: boolean, simple: boolean, onCinema?: (name: 'understory' | 'breathing', active: boolean) => void, onPrepare?: (name: 'understory' | 'breathing') => void, layoutKey?: string) {
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(frame)
  }, [layoutKey])
  useEffect(() => {
    if (!enabled || failed) return
    const context = gsap.context(() => {}, root)
    try { context.add(() => {
      const media = gsap.matchMedia()
      media.add({ mobile: '(max-width: 699px)', desktop: '(min-width: 700px)' }, match => {
        const mobile = !!match.conditions?.mobile
        const camera = gsap.timeline()
        const buildCamera = () => {
          camera.clear()
          const h = window.innerHeight
          const top = (id: string) => document.getElementById(id)!.getBoundingClientRect().top + window.scrollY
          const arrival = top('understory') - h, encounter = top('encounter') - h, ending = top('return') - h
          const near = { scale: mobile ? 1.55 : 1.95, xPercent: mobile ? 20 : 25, yPercent: 12 }
          const field = { scale: mobile ? .94 : 1.12, xPercent: mobile ? -6 : 7, yPercent: mobile ? -17 : 0 }
          // Pixel-length pauses in this one camera timeline preserve the exact pose across each plateau.
          // Multiple independent scrubs must not compete for the same camera transforms.
          camera.fromTo('.base-camera', { scale: 1, xPercent: 0, yPercent: 0, opacity: 1 }, { ...near, duration: h, ease: 'power2.inOut', immediateRender: false }, arrival)
            .fromTo('.foreground-camera', { opacity: 0, xPercent: 0, scale: 1 }, { opacity: 1, xPercent: -28, scale: 1.65, duration: h, immediateRender: false }, arrival)
            .fromTo('.cool-veil', { opacity: 0 }, { opacity: .64, duration: h, immediateRender: false }, arrival)
            .fromTo('.dark-veil', { opacity: 0 }, { opacity: .34, duration: h, immediateRender: false }, arrival)
            .fromTo('.light-shaft', { xPercent: 0, opacity: .15 }, { xPercent: 35, opacity: .02, duration: h, immediateRender: false }, arrival)
            .fromTo('.base-camera', near, { ...field, duration: h, ease: 'power2.inOut', immediateRender: false }, encounter)
            .fromTo('.foreground-camera', { xPercent: -28, opacity: 1 }, { xPercent: -75, opacity: 0, duration: h, immediateRender: false }, encounter)
            .fromTo('.cool-veil', { opacity: .64 }, { opacity: .22, duration: h, immediateRender: false }, encounter)
            .fromTo('.dark-veil', { opacity: .34 }, { opacity: .32, duration: h, immediateRender: false }, encounter)
            .fromTo('.base-camera', { opacity: 1 }, { opacity: 0, duration: h, immediateRender: false }, ending)
            .fromTo('.wide-environment', { opacity: 0, scale: 1.18 }, { opacity: 1, scale: 1, duration: h, ease: 'power2.out', immediateRender: false }, ending)
            .fromTo('.dark-veil', { opacity: .32 }, { opacity: .16, duration: h, immediateRender: false }, ending)
            .fromTo('.cool-veil', { opacity: .22 }, { opacity: 0, duration: h, immediateRender: false }, ending)
            .fromTo('.dawn-light', { opacity: 0, xPercent: 0 }, { opacity: .34, xPercent: -12, duration: h, immediateRender: false }, ending)
            .fromTo('.light-shaft', { opacity: .02, xPercent: 35 }, { opacity: .13, xPercent: -10, duration: h, immediateRender: false }, ending)
        }
        buildCamera()
        const trigger = ScrollTrigger.create({ animation: camera, trigger: '.world', start: 'top top', endTrigger: '#return', end: 'top top', scrub: simple ? true : .45, invalidateOnRefresh: true, onRefreshInit: buildCamera })
        return () => { trigger.kill(); camera.kill() }
      })
      const prepareMacro = ScrollTrigger.create({ trigger: '#understory', start: 'top 135%', once: true, onEnter: () => onPrepare?.('understory') })
      const prepareBreathing = ScrollTrigger.create({ trigger: '#return', start: 'top 135%', once: true, onEnter: () => onPrepare?.('breathing') })
      const enterMacro = gsap.timeline({ scrollTrigger: { trigger: '#understory', start: 'top 90%', end: 'top 20%', scrub: true } })
        .fromTo('.understory-cinema', { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, ease: 'none', duration: 1 }, 0)
        .fromTo('.foreground-carrier', { opacity: 1 }, { opacity: 0, ease: 'none', duration: 1 }, 0)
      const leaveMacro = gsap.timeline({ scrollTrigger: { trigger: '#encounter', start: 'top 95%', end: 'top 25%', scrub: true } })
        .to('.understory-cinema', { opacity: 0, ease: 'none', immediateRender: false, duration: 1 }, 0)
        .to('.foreground-carrier', { opacity: 1, ease: 'none', immediateRender: false, duration: 1 }, 0)
      const macro = ScrollTrigger.create({ trigger: '#understory', start: 'top 95%', endTrigger: '#encounter', end: 'top 25%', onToggle: trigger => onCinema?.('understory', trigger.isActive), onRefresh: trigger => onCinema?.('understory', trigger.isActive) })
      const breathing = ScrollTrigger.create({ trigger: '#return', start: 'top 95%', end: 'bottom top', onToggle: trigger => onCinema?.('breathing', trigger.isActive), onRefresh: trigger => onCinema?.('breathing', trigger.isActive) })
      return () => { media.revert(); prepareMacro.kill(); prepareBreathing.kill(); enterMacro.kill(); leaveMacro.kill(); macro.kill(); breathing.kill() }
    }) } catch {
      context.revert()
      const recover = requestAnimationFrame(() => setFailed(true))
      return () => cancelAnimationFrame(recover)
    }
    let active = true
    let refreshFrame = 0
    const refreshLayout = () => { cancelAnimationFrame(refreshFrame); refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh()) }
    const node = root.current
    node?.addEventListener('toggle', refreshLayout, true)
    document.fonts.ready.then(() => { if (active) ScrollTrigger.refresh() })
    return () => { active = false; cancelAnimationFrame(refreshFrame); node?.removeEventListener('toggle', refreshLayout, true); context.revert(); onCinema?.('understory', false); onCinema?.('breathing', false) }
  }, [root, enabled, simple, failed, onCinema, onPrepare])
  return failed
}
