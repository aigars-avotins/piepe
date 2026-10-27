import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import IntroFilm from './IntroFilm'
import { fieldNotes } from './content'

gsap.registerPlugin(ScrollTrigger)
const motionQuery = '(prefers-reduced-motion: reduce)'
const subscribeMotion = (callback: () => void) => {
  const query = matchMedia(motionQuery)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}
const getMotion = () => matchMedia(motionQuery).matches
function shouldPlayFilm() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  try {
    return !getMotion() && !connection?.saveData && !['slow-2g', '2g'].includes(connection?.effectiveType || '') && !sessionStorage.getItem('piepe-entered')
  } catch { return !getMotion() && !connection?.saveData }
}
function SporeMark({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 56 56" fill="none" aria-hidden="true"><path d="M8 25c0-15 40-15 40 0-10 12-30 12-40 0Z"/><path d="M14 35c8 9 20 9 28 0M21 43c4 5 10 5 14 0M28 28v20M18 23l10 5 10-5"/></svg>
}
function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '↓'}</span>
}

export default function App() {
  const reducedMotion = useSyncExternalStore(subscribeMotion, getMotion)
  const [intro, setIntro] = useState(shouldPlayFilm)
  const [filmMounted, setFilmMounted] = useState(intro)
  const [typography, setTypography] = useState(!intro)
  const [skipRequested, setSkipRequested] = useState(false)
  const [exitReason, setExitReason] = useState(intro ? '' : 'preference-or-return')
  const [discovery, setDiscovery] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const [motionPaused, setMotionPaused] = useState(false)
  const [plane, setPlane] = useState({ width: 1920, height: 1080, left: 0, top: 0 })
  const root = useRef<HTMLDivElement>(null)
  const environment = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const hotspot = useRef<HTMLButtonElement>(null)
  const unmountTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const finish = useCallback((reason: string) => {
    setIntro(false)
    setTypography(true)
    setExitReason(reason)
    if (reason === 'skipped') requestAnimationFrame(() => hotspot.current?.focus({ preventScroll: true }))
    try { sessionStorage.setItem('piepe-entered', '1') } catch { /* Storage may be disabled. */ }
    unmountTimer.current = setTimeout(() => setFilmMounted(false), 650)
  }, [])
  const revealTypography = useCallback(() => setTypography(true), [])

  useEffect(() => () => clearTimeout(unmountTimer.current), [])
  useEffect(() => {
    const query = matchMedia(motionQuery)
    const change = () => { if (query.matches) finish('reduced-motion') }
    query.addEventListener('change', change)
    return () => query.removeEventListener('change', change)
  }, [finish])

  useLayoutEffect(() => {
    const resize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      // Shared cover geometry for film, still and hotspot: exact same crop at every size.
      const scale = Math.max(width / 1920, height / 1080)
      const focalX = width < 700 ? 0.64 : 0.5
      setPlane({ width: 1920 * scale, height: 1080 * scale, left: (width - 1920 * scale) * focalX, top: (height - 1080 * scale) * 0.5 })
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    if (intro || reducedMotion || motionPaused) return
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element => {
        gsap.fromTo(element, { y: 36, opacity: 0.12 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: element, start: 'top 94%', end: 'top 68%', scrub: 0.6 } })
      })
    }, root)
    return () => context.revert()
  }, [intro, reducedMotion, motionPaused])

  useEffect(() => {
    if (intro || reducedMotion || motionPaused || !matchMedia('(pointer: fine)').matches) return
    const backdrop = environment.current!
    const x = gsap.quickTo(backdrop, 'x', { duration: 1.5, ease: 'power2.out' })
    const y = gsap.quickTo(backdrop, 'y', { duration: 1.5, ease: 'power2.out' })
    const move = (event: PointerEvent) => {
      x((event.clientX / innerWidth - 0.5) * 9)
      y((event.clientY / innerHeight - 0.5) * 6)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      gsap.killTweensOf(backdrop)
      gsap.set(backdrop, { x: 0, y: 0 })
    }
  }, [intro, reducedMotion, motionPaused])

  const openDiscovery = () => {
    setDiscovery(true)
    dialog.current?.showModal()
  }
  const closeDiscovery = () => {
    dialog.current?.close()
    setDiscovery(false)
    hotspot.current?.focus({ preventScroll: true })
  }
  const returnToForest = () => {
    history.replaceState(null, '', '#forest')
    document.getElementById('forest')?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: reducedMotion || motionPaused ? 'instant' : 'smooth' })
  }

  return <div ref={root} className={`world ${intro ? 'is-intro' : 'is-ready'} ${typography ? 'has-title' : ''} ${motionPaused ? 'motion-paused' : ''}`} data-intro-state={intro ? 'playing' : 'complete'} data-exit-reason={exitReason}>
    <a className="skip-content" href="#field-notes" onClick={() => intro && finish('skip-to-content')}>Skip to content</a>
    <div className="environment" ref={environment} aria-hidden="true">
      <div className="media-plane" style={plane}>
        <img className="forest-still" src="/media/forest-final.jpg" alt="" width="1920" height="1080" fetchPriority="high" onError={() => { setImageFailed(true); finish('image-error') }} />
        <div className={`film-wrap ${intro ? '' : 'film-finished'}`}>
          {filmMounted && <IntroFilm onFinish={finish} onTypography={revealTypography} skipRequested={skipRequested} />}
        </div>
      </div>
      <div className="forest-shade" />
      <div className="forest-mist mist-one" /><div className="forest-mist mist-two" />
      <div className="spores">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ left: `${(i * 29 + 11) % 100}%`, top: `${(i * 37 + 9) % 100}%`, animationDelay: `${-i * 1.7}s`, animationDuration: `${18 + i % 5 * 4}s` }} />)}</div>
      <div className="grain" />
    </div>

    <header className="site-header">
      <a href="#forest" className="brand" aria-label="pie.pe — return to forest" onClick={returnToForest}>pie.pe<span className="brand-dot" /></a>
      <span className="header-caption">An invitation to look closer</span>
      {intro ? <button className="text-button skip-intro" onClick={() => setSkipRequested(true)}>Skip intro <span aria-hidden="true">↗</span></button> : <a className="header-explore" href="#field-notes">Explore <span aria-hidden="true">↘</span></a>}
    </header>

    <main>
      <section id="forest" tabIndex={-1} className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow title-enter">A quiet kind of unexpected</p>
          <h1 id="hero-title" className="wordmark" aria-label="pie.pe"><span>pie</span><span className="wordmark-period">.</span><span>pe</span></h1>
          <p className="tagline title-enter">Not everything<br />is what it <em>seems.</em></p>
        </div>
        <div className="hero-hotspot-plane" style={plane}>
          <button ref={hotspot} className={`fungus-hotspot ${discovery ? 'is-discovered' : ''}`} disabled={intro} onClick={openDiscovery} aria-label="Discover the shelf fungus" aria-haspopup="dialog" style={{ left: '66.5%', top: '57%' }}>
            <span className="fungus-halo" /><span className="hotspot-pin"><span aria-hidden="true">+</span></span>
          </button>
        </div>
        <button className="discovery-cue" disabled={intro} onClick={openDiscovery}><span className="cue-line" />There is more here <span aria-hidden="true">↗</span></button>
        <div className="hero-foot title-enter">
          <p className="forest-index"><span className="small-cross" aria-hidden="true">+</span><span>Somewhere between<br />the ordinary & the unexpected</span></p>
          <a href="#understory" className="scroll-cue">Follow the quiet <span className="scroll-arrow"><Arrow /></span></a>
          <span className="scene-number">01 / 03</span>
        </div>
        {imageFailed && <p className="media-note">The forest is taking a little longer. There is still more to discover below.</p>}
      </section>

      <section id="understory" className="understory" aria-labelledby="understory-title">
        <div className="section-top" data-reveal><span className="eyebrow">01 — The understory</span><SporeMark className="spore-mark" /></div>
        <h2 id="understory-title" data-reveal>Big things.<br /><em>Quiet beginnings.</em></h2>
        <div className="understory-bottom" data-reveal><span className="vertical-rule" /><p>Under the surface, something is always growing.<br />An idea. A connection. A different way of seeing.</p><p className="aside-note">A little curiosity<br />goes a long way.</p></div>
      </section>

      <section id="field-notes" className="field-notes" aria-labelledby="notes-title">
        <div className="section-top" data-reveal><span className="eyebrow">02 — In the making</span><span className="section-coordinate">An ever-growing collection</span></div>
        <div className="notes-heading" data-reveal><h2 id="notes-title">Room to <em>grow.</em></h2><p>Ideas, experiments and<br />things worth discovering.</p></div>
        <div className="notes-list">{fieldNotes.map(note => <details key={note.number} className="field-note" data-reveal>
          <summary><span className="note-number">{note.number}</span><span className="note-title">{note.title}</span><span className="note-kind">{note.kind}</span><span className="note-toggle" aria-hidden="true">+</span></summary>
          <div className="note-body"><p>{note.description}</p><span className="note-status"><i />{note.status}</span></div>
        </details>)}</div>
        <p className="collection-note" data-reveal>First shoots, not finished projects. This place is just beginning.</p>
      </section>

      <section className="outro" aria-labelledby="outro-title">
        <div className="outro-inner" data-reveal><SporeMark className="outro-mark" /><p className="eyebrow">03 — Stay curious</p><h2 id="outro-title">Every forest<br />hides a <em>story.</em></h2><button className="return-link" onClick={returnToForest}>Return to forest <span aria-hidden="true">↑</span></button></div>
        <footer><a className="footer-brand" href="#forest" onClick={returnToForest}>pie.pe <span>— 2026</span></a><span className="footer-thought">Made of curiosity.</span><button className="motion-toggle" aria-pressed={motionPaused} onClick={() => setMotionPaused(value => !value)}>{motionPaused ? 'Resume atmosphere' : 'Pause atmosphere'} <span aria-hidden="true">{motionPaused ? '▷' : 'Ⅱ'}</span></button></footer>
      </section>
    </main>

    <dialog ref={dialog} className="discovery-dialog" onCancel={() => { setDiscovery(false) }} onClick={event => { if (event.target === event.currentTarget) closeDiscovery() }} aria-labelledby="discovery-title" aria-describedby="discovery-description">
      <div className="discovery-sheet"><button autoFocus className="close-discovery text-button" onClick={closeDiscovery} aria-label="Close discovery">Close <span aria-hidden="true">×</span></button><SporeMark className="discovery-mark" /><p className="eyebrow">You looked a little closer.</p><h2 id="discovery-title">Something is<br /><em>growing here.</em></h2><p id="discovery-description">A home for ideas, experiments and<br className="desktop-break" /> things worth discovering.</p><a href="#field-notes" className="discovery-link" onClick={closeDiscovery}>See what is taking root <Arrow diagonal /></a><span className="discovery-footnote">piepe — Latvian for bracket fungus</span></div>
    </dialog>
  </div>
}
