import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { localeFromPath, localePath, messages } from './i18n'
import type { Locale } from './i18n'
import { updateMetadata } from './seo'
import LanguageSwitch from './LanguageSwitch'
import Story from './Story'
import MotionClip from './MotionClip'
import { hasPlayedClip } from './clipHistory'
import IntroFilm from './IntroFilm'
import { ForestScene } from './ForestScene'
import Discovery from './Discovery'
import { useForestMotion } from './useForestMotion'
import { readSession, saveData, useReducedMotion, writeSession } from './usePreferences'

const chapters = ['forest', 'understory', 'encounter', 'return']
export default function App() {
  const [locale, setLocale] = useState<Locale>(() => localeFromPath(location.pathname))
  const t = messages[locale]
  const [awakening, setAwakening] = useState(false)
  const changeLocale = (value: Locale) => {
    if (value === locale) return
    history.pushState(null, '', localePath(value) + location.hash)
    setLocale(value)
  }
  useEffect(() => { updateMetadata(locale) }, [locale])
  useEffect(() => {
    const pop = () => setLocale(localeFromPath(location.pathname))
    window.addEventListener('popstate', pop)
    return () => window.removeEventListener('popstate', pop)
  }, [])
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
  const finishLock = useRef(false)
  const unmountTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const finish = useCallback((reason: string) => {
    if (finishLock.current) return
    finishLock.current = true
    clearTimeout(unmountTimer.current)
    setIntro(false); setTypography(true); setExitReason(reason)
    writeSession('piepe-entered')
    unmountTimer.current = setTimeout(() => setFilmMounted(false), 650)
  }, [])
  useEffect(() => {
    if (!intro && exitReason === 'skipped') hotspot.current?.focus({ preventScroll: true })
  }, [intro, exitReason])
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
      const { width, height } = environment.current?.getBoundingClientRect() ?? { width: window.innerWidth, height: window.innerHeight }
      const scale = Math.max(width / 1920, height / 1080)
      const focal = width < 700 ? .64 : .5
      setPlane({ width: 1920 * scale, height: 1080 * scale, left: (width - 1920 * scale) * focal, top: (height - 1080 * scale) * .5 })
    }
    const observer = new ResizeObserver(resize)
    if (environment.current) observer.observe(environment.current)
    resize(); window.addEventListener('resize', resize)
    return () => { observer.disconnect(); window.removeEventListener('resize', resize) }
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
    setAwakening(!reduced && !dataSaving && !paused && !hasPlayedClip('awakening'))
    setDiscovery(true); setInspect(false)
    dialog.current?.showModal()
  }
  const closeDiscovery = () => {
    dialog.current?.close(); setDiscovery(false); setAwakening(false)
    opener.current?.focus({ preventScroll: true })
  }
  const returnToForest = () => {
    history.replaceState(null, '', '#forest')
    document.getElementById('forest')?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: reduced || paused ? 'instant' : 'smooth' })
  }
  const replay = () => {
    finishLock.current = false
    clearTimeout(unmountTimer.current)
    history.replaceState(null, '', '#forest')
    window.scrollTo({ top: 0, behavior: 'instant' })
    setTypography(false); setSkipRequested(false); setFilmKey(key => key + 1)
    setFilmMounted(true); setExitReason(''); setIntro(true)
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('.skip-intro')?.focus({ preventScroll: true }))
  }
  const collect = () => { writeSession('piepe-note-found'); setCollected(true) }
  const inspectEvents = { onMouseEnter: () => setInspect(true), onMouseLeave: () => setInspect(false), onFocus: () => setInspect(true), onBlur: () => setInspect(false) }

  return <div ref={root} className={`world ${intro ? 'is-intro' : 'is-ready'} ${typography ? 'has-title' : ''} ${reduced || paused || motionFailed ? 'motion-off' : ''} ${hidden || paused || discovery ? 'atmosphere-paused' : ''} ${dataSaving ? 'data-saving' : ''} ${collected ? 'has-note' : ''}`} data-version="2.1" data-scene={scene} data-intro-state={intro ? 'playing' : 'complete'} data-exit-reason={exitReason}>
    <a className="skip-content" href="#understory" onClick={() => intro && finish('skip-to-content')}>{t.skipContent}</a>
    <ForestScene ref={environment} plane={plane} inspect={inspect}>
      <div className={`film-wrap ${intro ? '' : 'film-finished'}`}>{filmMounted && <IntroFilm key={filmKey} onFinish={finish} onTypography={revealTypography} skipRequested={skipRequested} />}</div>
    </ForestScene>
    {!filmMounted && !discovery && (scene === 'understory' || scene === 'return') && <div className="scene-cinema" data-cinema-scene={scene}>
      <MotionClip key={scene} name={scene === 'understory' ? 'understory' : 'breathing'} enabled={!reduced && !dataSaving && !paused} />
      <div className="cinema-shade" />
    </div>}
    <img className="asset-monitor" src="/media/forest-final.jpg" alt="" aria-hidden="true" onError={() => { setImageFailed(true); finish('image-error') }} />
    <header className="site-header">
      <a className="brand" href="#forest" onClick={returnToForest} aria-label={t.homeLabel}><img src="/brand-mark.svg" alt="" width="40" height="40" />pie.pe</a>
      <span className="header-caption">{t.forest}</span><LanguageSwitch locale={locale} onChange={changeLocale} />
      {intro ? <button className="text-button skip-intro" onClick={() => setSkipRequested(true)}>{t.skipIntro} <span aria-hidden="true">↗</span></button> : <button className="text-button replay-intro" onClick={replay} aria-label={t.replayLabel}>{t.replay} <span aria-hidden="true">↺</span></button>}
    </header>
    <nav className="journey-index" aria-label={t.forest}>{chapters.map((chapter, index) => <a key={chapter} href={`#${chapter}`} aria-current={scene === chapter ? 'location' : undefined}><span>0{index + 1}</span><i /><span>{t.chapters[index]}</span></a>)}</nav>
    <Story locale={locale} plane={plane} hotspot={hotspot} intro={intro} imageFailed={imageFailed} collected={collected} paused={paused} onDiscovery={openDiscovery} onReturn={returnToForest} onPause={() => setPaused(value => !value)} inspectEvents={inspectEvents} />
    <Discovery locale={locale} onLocaleChange={changeLocale} awakening={awakening} onAwakeningEnd={() => setAwakening(false)} plane={plane} enabled={!reduced && !dataSaving && !paused} open={discovery} dialog={dialog} onClose={closeDiscovery} onCollect={collect} collected={collected} />
  </div>
}
