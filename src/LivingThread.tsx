import {useEffect, useRef, useState} from 'react'
import {createPortal} from 'react-dom'
import type {RefObject} from 'react'
import type {Locale} from './i18n'

import {threadCopy} from './threadCopy'

// One small, input-driven composited light. It never duplicates or filters the film.
// No idle animation loop; releasing touch, leaving, resizing or hiding removes it.
export default function LivingThread({locale, view, moving, onClose}: {
  locale: Locale; view: RefObject<HTMLDivElement | null>; moving: boolean; onClose: () => void
}) {
  const [beat, setBeat] = useState(0)
  const lens = useRef<HTMLDivElement>(null)
  const t = threadCopy[locale]
  useEffect(() => {
    if (!moving || !view.current || !lens.current) return
    const surface = view.current, light = lens.current
    let frame = 0, x = .5, y = .4
    const hide = () => {cancelAnimationFrame(frame); frame = 0; light.style.opacity = '0'}
    const paint = () => {
      frame = 0
      light.style.transform = `translate3d(${x * surface.clientWidth}px,${y * surface.clientHeight}px,0) translate(-50%,-50%)`
      light.style.opacity = '1'
    }
    const schedule = () => {if (!frame) frame = requestAnimationFrame(paint)}
    const point = (event: PointerEvent) => {
      if (event.pointerType === 'touch' && !event.isPrimary) {hide(); return}
      if (event.pointerType === 'touch' && event.type === 'pointermove' && !event.buttons) return
      const bounds = surface.getBoundingClientRect()
      x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width))
      y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height))
      schedule()
    }
    const key = (event: KeyboardEvent) => {
      if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','Enter'].includes(event.key)) return
      event.preventDefault()
      if (event.key === 'Home') {x = .5; y = .4; setBeat(0)}
      else if (event.key === 'Enter') setBeat(value => (value + 1) % 3)
      else {
        x = Math.max(.1, Math.min(.9, x + (event.key === 'ArrowLeft' ? -.1 : event.key === 'ArrowRight' ? .1 : 0)))
        y = Math.max(.15, Math.min(.7, y + (event.key === 'ArrowUp' ? -.1 : event.key === 'ArrowDown' ? .1 : 0)))
      }
      schedule()
    }
    surface.addEventListener('pointerdown', point)
    surface.addEventListener('pointermove', point)
    surface.addEventListener('keydown', key)
    const endings = ['pointerleave','pointerup','pointercancel','blur'] as const
    endings.forEach(name => surface.addEventListener(name, hide))
    window.addEventListener('resize', hide)
    window.visualViewport?.addEventListener('resize', hide)
    document.addEventListener('visibilitychange', hide)
    return () => {
      hide()
      surface.removeEventListener('pointerdown', point)
      surface.removeEventListener('pointermove', point)
      surface.removeEventListener('keydown', key)
      endings.forEach(name => surface.removeEventListener(name, hide))
      window.removeEventListener('resize', hide)
      window.visualViewport?.removeEventListener('resize', hide)
      document.removeEventListener('visibilitychange', hide)
    }
  }, [moving, view])
  return <>
    {moving && view.current && createPortal(<div ref={lens} className="thread-light" data-thread-light aria-hidden="true"/>, view.current)}
    <section className="living-thread" aria-label={t.follow} data-living-thread>
      <div className="thread-navigation" role="group" aria-label={t.beats}>
        {t.stories.map((story, index) => <button key={index} type="button" aria-pressed={beat === index} aria-controls="thread-story" aria-label={`${index + 1}. ${story.title}`} onClick={() => setBeat(index)}>{String(index + 1).padStart(2, '0')}</button>)}
        <button className="thread-close" type="button" onClick={onClose} aria-label={t.close}><span aria-hidden="true">×</span></button>
      </div>
      <div id="thread-story" role="status" aria-live="polite" aria-atomic="true"><h3>{t.stories[beat].title}</h3><p>{t.stories[beat].text}</p></div>
    </section>
  </>
}
