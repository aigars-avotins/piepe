import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import IntroFilm from './IntroFilm'
import { ForestScene } from './ForestScene'
import Discovery from './Discovery'
import { useForestMotion } from './useForestMotion'
import { readSession, saveData, useReducedMotion, writeSession } from './usePreferences'

const chapters = [{ id: 'forest', label: 'Surface' }, { id: 'understory', label: 'Beneath' }, { id: 'encounter', label: 'Encounter' }, { id: 'return', label: 'Return' }]
export default function App() {
  const reduced = useReducedMotion()
  const [dataSaving] = useState(saveData)
  const [intro, setIntro] = useState(() => !matchMedia('(prefers-reduced-motion: reduce)').matches && !saveData() && !readSession('piepe-entered'))
  const [filmMounted, setFilmMounted] = useState(intro)
  const [filmKey, setFilmKey] = useState(0)
  const [typography, setTypography] = useState(!intro)
  const [skipRequested, setSkipRequested] = useState(false)
  const [exitReason, setExitReason] = useState(intro ? '' : 'preference-or-return')
  const [discovery, setDiscovery] = useState(false)
  const [collected, setCollected] = useState(() => readSession('piepe-note-found'))
  const [inspect, setInspect] = useState(false)
  const [paused, setPaused] = useState(false)
  const [hidden, setHidden] = useState(document.hidden)
  const [scene, setScene] = useState('forest')
  const [imageFailed, setImageFailed] = useState(false)
  const [plane, setPlane] = useState({ width: 1920, height: 1080, left: 0, top: 0 })
  const root = useRef<HTMLDivElement>(null)
  const environment = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const hotspot = useRef<HTMLButtonElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const unmountTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const finish = useCallback((reason: string) => {
    clearTimeout(unmountTimer.current)
    setIntro(false); setTypography(true); setExitReason(reason)
    writeSession('piepe-entered')
    if (reason === 'skipped') requestAnimationFrame(() => hotspot.current?.focus({ preventScroll: true }))
    unmountTimer.current = setTimeout(() => setFilmMounted(false), 650)
  }, [])
  const revealTypography = useCallback(() => setTypography(true), [])
  useEffect(() => () => clearTimeout(unmountTimer.current), [])
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => { if (query.matches) finish('reduced-motion') }
    const visibility = () => setHidden(document.hidden)
    query.addEventListener('change', change)
    document.addEventListener('visibilitychange', visibility)
    return () => { query.removeEventListener('change', change); document.removeEventListener('visibilitychange', visibility) }
  }, [finish])
  useLayoutEffect(() => {
    const resize = () => {
      const width = window.innerWidth, height = window.innerHeight
      const scale = Math.max(width / 1920, height / 1080)
      const focal = width < 700 ? .64 : .5
      setPlane({ width: 1920 * scale, height: 1080 * scale, left: (width - 1920 * scale) * focal, top: (height - 1080 * scale) * .5 })
    }
    resize(); window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])
  useEffect(() => {
    const visibility = new Map<string, number>()
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0))
      const best = [...visibility].sort((a, b) => b[1] - a[1])[0]
      if (best?.[1]) setScene(best[0])
    }, { threshold: [0, .2, .4, .6, .8] })
    root.current?.querySelectorAll('section[data-scene]').forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  const motionFailed = useForestMotion(root, !intro && !reduced && !paused, dataSaving)

  const openDiscovery = (event: React.MouseEvent<HTMLButtonElement>) => {
    opener.current = event.currentTarget
    setDiscovery(true); setInspect(false)
    dialog.current?.showModal()
  }
  const closeDiscovery = () => {
    dialog.current?.close(); setDiscovery(false)
    opener.current?.focus({ preventScroll: true })
  }
  const returnToForest = () => {
    history.replaceState(null, '', '#forest')
    document.getElementById('forest')?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: reduced || paused ? 'instant' : 'smooth' })
  }
  const replay = () => {
    clearTimeout(unmountTimer.current)
    history.replaceState(null, '', '#forest')
    window.scrollTo({ top: 0, behavior: 'instant' })
    setTypography(false); setSkipRequested(false); setFilmKey(key => key + 1)
    setFilmMounted(true); setExitReason(''); setIntro(true)
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('.skip-intro')?.focus({ preventScroll: true }))
  }
  const collect = () => { writeSession('piepe-note-found'); setCollected(true) }
  const inspectEvents = { onMouseEnter: () => setInspect(true), onMouseLeave: () => setInspect(false), onFocus: () => setInspect(true), onBlur: () => setInspect(false) }

  return <div ref={root} className={`world ${intro ? 'is-intro' : 'is-ready'} ${typography ? 'has-title' : ''} ${reduced || paused || motionFailed ? 'motion-off' : ''} ${hidden || paused || discovery ? 'atmosphere-paused' : ''} ${dataSaving ? 'data-saving' : ''} ${collected ? 'has-note' : ''}`} data-version="2.0" data-scene={scene} data-intro-state={intro ? 'playing' : 'complete'} data-exit-reason={exitReason}>
    <a className="skip-content" href="#understory" onClick={() => intro && finish('skip-to-content')}>Skip to content</a>
    <ForestScene ref={environment} plane={plane} inspect={inspect}>
      <div className={`film-wrap ${intro ? '' : 'film-finished'}`}>{filmMounted && <IntroFilm key={filmKey} onFinish={finish} onTypography={revealTypography} skipRequested={skipRequested} />}</div>
    </ForestScene>
    <img className="asset-monitor" src="/media/forest-final.jpg" alt="" aria-hidden="true" onError={() => { setImageFailed(true); finish('image-error') }} />
    <header className="site-header">
      <a className="brand" href="#forest" onClick={returnToForest} aria-label="pie.pe — return to forest">pie.pe<span className="tiny-dot" /></a>
      <span className="header-caption">The living forest <span>—</span> An atlas of attention</span>
      {intro ? <button className="text-button skip-intro" onClick={() => setSkipRequested(true)}>Skip intro <span aria-hidden="true">↗</span></button> : <button className="text-button replay-intro" onClick={replay} aria-label="Replay introduction">Replay film <span aria-hidden="true">↺</span></button>}
    </header>
    <nav className="journey-index" aria-label="Forest chapters">{chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} aria-current={scene === chapter.id ? 'location' : undefined}><span>0{index + 1}</span><i /><span>{chapter.label}</span></a>)}</nav>
    <main>
      <section id="forest" tabIndex={-1} className="hero" data-scene="surface" aria-labelledby="hero-title">
        <div className="hero-copy"><p className="label title-enter">An invitation to look closer</p><h1 id="hero-title" className="wordmark" aria-label="pie.pe"><span>pie</span><span className="wordmark-period">.</span><span>pe</span></h1><p className="hero-deck title-enter">The forest keeps more<br />than it shows.</p></div>
        <div className="hero-hotspot-plane" style={plane}>
          <button className="fungus-hit" disabled={intro} onClick={openDiscovery} aria-label="Discover the shelf fungus" aria-haspopup="dialog" {...inspectEvents} />
          <button ref={hotspot} className="fungus-annotation" disabled={intro} onClick={openDiscovery} aria-label="Look closer at the fungus" aria-haspopup="dialog" {...inspectEvents}><span className="annotation-cross" aria-hidden="true">+</span><span>Look closer <span aria-hidden="true">↗</span></span></button>
        </div>
        <div className="hero-foot title-enter"><p><span lang="lv">piepe</span><span className="foot-rule" />Latvian for bracket fungus</p><a className="scroll-cue" href="#understory">Follow what is hidden <span aria-hidden="true">↓</span></a><span className="edition">Forest encounter · 001</span></div>
        {imageFailed && <p className="media-note">The image could not load. The field note is still here: <button onClick={openDiscovery}>open the encounter</button>.</p>}
      </section>
      <section id="understory" className="chapter bark-chapter" data-scene="bark" aria-labelledby="bark-title">
        <div className="chapter-label"><span className="label">01 / Beneath the bark</span><span className="chapter-line" /></div>
        <div className="bark-copy"><p className="margin-note">Let the obvious<br />fall out of view.</p><h2 id="bark-title">Nothing begins<br />at the <em>surface.</em></h2><p className="chapter-body">Follow the grain. Past the edge of the light.<br />What you can see is only a place to begin.</p><a className="line-link" href="#encounter">Stay a little longer <span aria-hidden="true">↓</span></a></div>
        <span className="depth-coordinate" aria-hidden="true">Below the familiar</span>
      </section>
      <section id="encounter" className="chapter encounter-chapter" data-scene="encounter" aria-labelledby="encounter-title">
        <div className="chapter-label"><span className="label">02 / The encounter</span><span className="chapter-line" /></div>
        <div className="encounter-copy"><p className="label warm-label">Small enough to overlook.</p><h2 id="encounter-title">A doorway,<br /><em>disguised.</em></h2><p className="chapter-body">A shelf in the bark. A pale, patient edge.<br />Three observations. One different way of seeing.</p><button className="line-link" onClick={openDiscovery} {...inspectEvents}>Open the field note <span aria-hidden="true">↗</span></button><p className="encounter-status">{collected ? 'Field note 001 · Collected' : 'Field note 001 · Waiting to be found'}</p></div>
        <button className="specimen-invitation" onClick={openDiscovery} {...inspectEvents} aria-label="Enter the fungus encounter"><span className="annotation-cross" aria-hidden="true">+</span><span>The visible is only the beginning</span></button>
      </section>
      <section id="return" className="chapter return-chapter" data-scene="return" aria-labelledby="return-title">
        <div className="return-copy"><p className="label">03 / Back in the light</p><h2 id="return-title">Same forest.<br /><em>Another way of seeing.</em></h2><p className="return-thought">One ordinary thing. One moment of attention.<br />Take that with you.</p><button className="line-link" onClick={returnToForest}>Return to forest <span aria-hidden="true">↑</span></button></div>
        <footer><a className="brand" href="#forest" onClick={returnToForest}>pie.pe<span className="tiny-dot" /></a><span className="footer-edition">The living forest — 2026</span><button className="text-button motion-toggle" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? 'Resume atmosphere' : 'Pause atmosphere'} <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span></button></footer>
      </section>
    </main>
    <Discovery dialog={dialog} onClose={closeDiscovery} onCollect={collect} collected={collected} />
  </div>
}
