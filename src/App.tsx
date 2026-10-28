import Arrow from './Arrow'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { localeFromPath, localePath, messages } from './i18n'
import type { Locale } from './i18n'
import type { CSSProperties } from 'react'
import { updateMetadata } from './seo'
import LanguageSwitch from './LanguageSwitch'
import Story from './Story'
import MotionClip from './MotionClip'
import { cinemaOrigin } from './cinemaGeometry'
import type { CinemaOrigin } from './cinemaGeometry'
import { hasPlayedClip } from './clipHistory'
import IntroFilm from './IntroFilm'
import { ForestScene } from './ForestScene'
import Discovery from './Discovery'
import { useForestMotion } from './useForestMotion'
import { readSession, saveData, useReducedMotion, writeSession } from './usePreferences'
import { useForestAudio } from './useForestAudio'
import SoundControl from './SoundControl'

const chapters = ['forest', 'understory', 'encounter', 'return']
export default function App({ initialLocale }: { initialLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(() => initialLocale || localeFromPath(location.pathname))
  const t = messages[locale]
  const audio = useForestAudio()
  const [awakening, setAwakening] = useState<'idle' | 'preparing' | 'playing' | 'docking'>('idle')
  const [heldFrame, setHeldFrame] = useState('/media/forest-final.jpg')
  const [origin, setOrigin] = useState<CinemaOrigin>()
  const [cinemaActive, setCinemaActive] = useState({ understory: false, breathing: false })
  const [cinemaMounted, setCinemaMounted] = useState({ understory: false, breathing: false })
  const prepareCinema = useCallback((name: 'understory' | 'breathing') => {
    setCinemaMounted(value => value[name] ? value : { ...value, [name]: true })
  }, [])
  const changeCinema = useCallback((name: 'understory' | 'breathing', active: boolean) => {
    if (active) setCinemaMounted(value => value[name] ? value : { ...value, [name]: true })
    setCinemaActive(value => value[name] === active ? value : { ...value, [name]: active })
  }, [])
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
  const [dataSaving, setDataSaving] = useState(false)
  const [booted, setBooted] = useState(false)
  const [intro, setIntro] = useState(true)
  const [filmMounted, setFilmMounted] = useState(false)
  const [filmKey, setFilmKey] = useState(0)
  const [typography, setTypography] = useState(false)
  const [skipRequested, setSkipRequested] = useState(false)
  const [exitReason, setExitReason] = useState(intro ? '' : 'preference-or-return')
  const [discovery, setDiscovery] = useState(false)
  const [collected, setCollected] = useState(false)
  const [inspect, setInspect] = useState(false)
  const [paused, setPaused] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scene, setScene] = useState('forest')
  const [imageFailed, setImageFailed] = useState(false)
  const [plane, setPlane] = useState<CSSProperties>({ width: 'max(100vw,177.777778dvh)', height: 'max(56.25vw,100dvh)', left: 'calc((100vw - max(100vw,177.777778dvh)) * var(--forest-focal,.5))', top: 'calc((100dvh - max(56.25vw,100dvh)) * .5)' })
  const root = useRef<HTMLDivElement>(null)
  const environment = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const hotspot = useRef<HTMLButtonElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const restoreFocus = useRef(false)
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
  const initialize = useCallback(() => {
    const saving = saveData(), staticVisit = matchMedia('(prefers-reduced-motion: reduce)').matches || saving || readSession('piepe-entered')
    setDataSaving(saving); setCollected(readSession('piepe-note-found')); setBooted(true)
    const image = document.querySelector<HTMLImageElement>('.asset-monitor')
    if (image?.complete && !image.naturalWidth) { setImageFailed(true); finish('image-error') }
    else if (staticVisit) finish('preference-or-return')
    else if (document.documentElement.dataset.skipIntro === '1') finish('skipped')
    else setFilmMounted(true)
  }, [finish])
  // Keep the server-painted controls stable; start cinema after hydration's first paint.
  useEffect(() => { const frame = requestAnimationFrame(initialize); return () => cancelAnimationFrame(frame) }, [initialize])
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
  const motionFailed = useForestMotion(root, !intro && !reduced && !paused, dataSaving, changeCinema, prepareCinema)

  const showNote = useCallback((animate: boolean, frame: string) => {
    setHeldFrame(frame); setOrigin(animate ? cinemaOrigin() : undefined); setDiscovery(true)
    if (!animate) setAwakening('idle')
  }, [])
  const freezeFrame = useCallback(() => {
    const video = document.querySelector<HTMLVideoElement>('video[src$="awakening.mp4"]')
    if (!video || video.readyState < 2) return heldFrame
    try { const canvas = document.createElement('canvas'); canvas.width = video.videoWidth; canvas.height = video.videoHeight; canvas.getContext('2d')!.drawImage(video, 0, 0); return canvas.toDataURL('image/jpeg', .95) } catch { return heldFrame }
  }, [heldFrame])
  const completeAwakening = useCallback((reason: string) => {
    if (reason === 'still-error' || reason === 'still-timeout') { setAwakening('docking'); showNote(true, freezeFrame()) }
    else if (reason === 'ended') { setAwakening('docking'); showNote(true, '/media/forest-awakening-final.jpg') }
    else showNote(false, freezeFrame())
  }, [showNote, freezeFrame])
  const skipAwakening = () => showNote(false, freezeFrame())
  const openDiscovery = (event: React.MouseEvent<HTMLButtonElement>) => {
    opener.current = event.currentTarget; setInspect(false)
    const realFungus = event.currentTarget.matches('.fungus-hit, .fungus-annotation')
    if (realFungus && !reduced && !dataSaving && !paused && !hasPlayedClip('awakening')) setAwakening('preparing')
    else showNote(realFungus && !reduced && !dataSaving && !paused, heldFrame)
  }
  const closeDiscovery = () => {
    restoreFocus.current = true
    dialog.current?.close(); setDiscovery(false); setAwakening('idle')
  }
  useLayoutEffect(() => {
    if (!restoreFocus.current || discovery || awakening !== 'idle') return
    restoreFocus.current = false
    opener.current?.focus({ preventScroll: true })
  }, [discovery, awakening])
  const cinemaRunning = awakening === 'preparing' || awakening === 'playing'
  useEffect(() => {
    if (!cinemaRunning) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); restoreFocus.current = true; setHeldFrame(freezeFrame()); setAwakening('idle') } }
    document.addEventListener('keydown', escape)
    document.querySelector<HTMLButtonElement>('.skip-awakening')?.focus({ preventScroll: true })
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', escape) }
  }, [cinemaRunning, freezeFrame])
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
    setHeldFrame('/media/forest-final.jpg'); setTypography(false); setSkipRequested(false); setFilmKey(key => key + 1)
    setFilmMounted(true); setExitReason(''); setIntro(true)
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('.skip-intro')?.focus({ preventScroll: true }))
  }
  const collect = () => { writeSession('piepe-note-found'); setCollected(true) }
  const inspectEvents = { onMouseEnter: () => setInspect(true), onMouseLeave: () => setInspect(false), onFocus: () => setInspect(true), onBlur: () => setInspect(false) }

  return <div ref={root} className={`world ${!booted ? 'prerendered' : ''} ${intro ? 'is-intro' : 'is-ready'} ${typography ? 'has-title' : ''} ${reduced || paused || motionFailed ? 'motion-off' : ''} ${hidden || paused || discovery || awakening !== 'idle' || cinemaActive.understory || cinemaActive.breathing ? 'atmosphere-paused' : ''} ${dataSaving ? 'data-saving' : ''} ${collected ? 'has-note' : ''} ${discovery ? 'discovery-open' : ''} ${heldFrame.endsWith('forest-awakening-final.jpg') ? 'has-awakened' : ''} ${awakening !== 'idle' ? 'has-awakening' : ''} ${awakening === 'playing' || awakening === 'docking' ? 'cinema-presented' : ''}`} data-version="2.2" data-awakening={awakening} data-scene={scene} data-intro-state={intro ? 'playing' : 'complete'} data-exit-reason={exitReason}>
    <a className="skip-content" href="#understory" onClick={() => intro && finish('skip-to-content')}>{t.skipContent}</a>
    <ForestScene ref={environment} plane={plane} inspect={inspect && (scene === 'forest' || scene === 'encounter')} still={heldFrame}
      macro={cinemaMounted.understory && <MotionClip name="understory" enabled={!reduced && !dataSaving && !paused} active={cinemaActive.understory && !intro && !discovery && awakening === 'idle'} />}
      breathing={cinemaMounted.breathing && <MotionClip name="breathing" enabled={!reduced && !dataSaving && !paused} active={cinemaActive.breathing && !intro && !discovery && awakening === 'idle'} />}>
      {awakening !== 'idle' && <div className="world-awakening"><MotionClip name="awakening" enabled={!reduced && !dataSaving && !paused} onReady={() => setAwakening('playing')} onFinish={completeAwakening} /></div>}
      <div className={`film-wrap ${intro ? '' : 'film-finished'}`}>{filmMounted && <IntroFilm key={filmKey} onFinish={finish} onTypography={revealTypography} skipRequested={skipRequested} />}</div>
    </ForestScene>
    {awakening !== 'idle' && !discovery && <div className="awakening-controls" role="region" aria-label={t.awakening}>
      <button className="text-button skip-awakening" onClick={skipAwakening}>{t.skipAwakening} <Arrow direction="right" /></button>
    </div>}
    <img className="asset-monitor" src="/media/forest-final.jpg" alt="" aria-hidden="true" onError={() => { setImageFailed(true); finish('image-error') }} />
    <header className="site-header">
      <a className="brand" href="#forest" onClick={returnToForest} aria-label={t.homeLabel}><img src="/brand-mark.svg" alt="" width="40" height="40" /><img className="brand-wordmark" src="/brand-wordmark.svg" alt="pie.pe" width="64" height="34" /></a>
      <span className="header-caption">{t.forest}</span><LanguageSwitch locale={locale} onChange={changeLocale} />
      {intro ? <button className="text-button skip-intro" onClick={() => setSkipRequested(true)}>{t.skipIntro} <span aria-hidden="true"><Arrow direction="diagonal" /></span></button> : <button className="text-button replay-intro" onClick={replay} aria-label={t.replayLabel}>{t.replay} <span aria-hidden="true">↺</span></button>}
    </header>
    <nav inert={cinemaRunning} className="journey-index" aria-label={t.forest}>{chapters.map((chapter, index) => <a key={chapter} href={`#${chapter}`} aria-current={scene === chapter ? 'location' : undefined}><span>0{index + 1}</span><i /><span>{t.chapters[index]}</span></a>)}</nav>
    <Story inactive={cinemaRunning} locale={locale} plane={plane} hotspot={hotspot} intro={intro} imageFailed={imageFailed} collected={collected} paused={paused} onDiscovery={openDiscovery} onReturn={returnToForest} onPause={() => setPaused(value => !value)} inspectEvents={inspectEvents} />
    {!discovery && <SoundControl audio={audio} locale={locale} />}
    <Discovery audio={audio} locale={locale} onLocaleChange={changeLocale} origin={origin} photoSrc={heldFrame} onDocked={() => setAwakening('idle')} open={discovery} dialog={dialog} onClose={closeDiscovery} onCollect={collect} collected={collected} />
  </div>
}
