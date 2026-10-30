import { useEffect, useRef, useState } from 'react'
import { mediaUrl } from './mediaUrl'

type Props = { name: 'understory' | 'breathing'; enabled: boolean; active?: boolean; onReady?: () => void; onFinish?: (reason: string) => void }

/** One decoder per visible visit. A painted end-frame bridges a forward replay, never a session flag. */
export default function EnvironmentalFilm({ name, enabled, active = true, onReady, onFinish }: Props) {
  const [ready, setReady] = useState(false), [staged, setStaged] = useState(false), [posterReady, setPosterReady] = useState(false)
  const [held, setHeld] = useState(false), [cycles, setCycles] = useState(0), [reason, setReason] = useState('')
  const video = useRef<HTMLVideoElement>(null), carrier = useRef<HTMLCanvasElement>(null)
  const callbacks = useRef({ onReady, onFinish })
  useEffect(() => { callbacks.current = { onReady, onFinish } }, [onReady, onFinish])
  useEffect(() => {
    if (!enabled || !active) return
    const film = video.current!, canvas = carrier.current!
    let disposed = false, failed = false, presented = false, callback = 0, restart = 0, previous = -1, progressAt = performance.now()
    const hold = () => {
      if (film.readyState < 2) return
      canvas.width = film.videoWidth; canvas.height = film.videoHeight
      canvas.getContext('2d')?.drawImage(film, 0, 0)
      setHeld(true)
    }
    const fail = (why: string) => {
      if (disposed || failed) return
      failed = true; film.pause(); hold(); setReason(why); callbacks.current.onFinish?.(why)
    }
    const present = () => {
      if (disposed || failed) return
      if (film.readyState < 2) { decode(); return }
      setHeld(false); setReady(true)
      if (!presented) { presented = true; callbacks.current.onReady?.() }
    }
    const decode = () => {
      if (film.requestVideoFrameCallback) callback = film.requestVideoFrameCallback(present)
      else callback = requestAnimationFrame(present)
    }
    // WebKit may cull a fully transparent video before its first presentation.
    // Stage only decoded pixels; the actual frame callback still owns readiness.
    const stage = () => { if (!disposed && !failed && film.readyState >= 2) setStaged(true) }
    const loaded = () => { stage(); decode() }
    const play = () => {
      if (disposed || failed || document.hidden) return
      progressAt = performance.now()
      film.play().catch(() => fail('autoplay-blocked'))
    }
    const ended = () => {
      if (disposed || failed) return
      hold(); setCycles(count => count + 1); setReason('ended')
      // Paint the actual ending before seeking this same decoder back to its first frame.
      restart = requestAnimationFrame(() => {
        if (disposed || failed) return
        film.currentTime = 0; decode(); play()
      })
    }
    const visibility = () => { if (document.hidden) film.pause(); else { if (film.ended) ended(); else play() } }
    const error = () => fail('media-error')
    film.addEventListener('loadeddata', loaded, { once: true }); if (film.readyState >= 2) loaded()
    film.addEventListener('ended', ended); film.addEventListener('error', error)
    document.addEventListener('visibilitychange', visibility)
    const watchdog = setInterval(() => {
      if (document.hidden || disposed || failed) return
      const now = performance.now()
      if (film.currentTime !== previous) { previous = film.currentTime; progressAt = now }
      else if (now - progressAt > (presented ? 3500 : 8000)) fail(presented ? 'stalled' : 'load-timeout')
    }, 250)
    film.muted = true; play()
    return () => {
      disposed = true; clearInterval(watchdog); cancelAnimationFrame(restart)
      if (film.cancelVideoFrameCallback) film.cancelVideoFrameCallback(callback); else cancelAnimationFrame(callback)
      film.pause(); film.removeEventListener('loadeddata', loaded); film.removeEventListener('ended', ended); film.removeEventListener('error', error)
      document.removeEventListener('visibilitychange', visibility); film.removeAttribute('src'); film.load()
    }
  }, [name, enabled, active])
  const poster = mediaUrl(`/media/forest-${name}${name === 'understory' ? '' : '-poster'}.jpg`)
  return <div className={`motion-clip clip-${name}`} data-clip={name} data-clip-state={!active || !enabled ? 'idle' : reason && reason !== 'ended' ? 'error' : ready ? 'playing' : 'preparing'} data-clip-ready={ready} data-frame-staged={staged} data-still-ready={posterReady} data-clip-reason={reason} data-clip-cycles={cycles} data-loop-hold={held} aria-hidden="true">
    <img className="clip-end" src={mediaUrl(`/media/forest-${name}-final.jpg`)} fetchPriority="low" alt="" width={name === 'understory' ? 1900 : 1920} height={name === 'understory' ? 988 : 1080} />
    <img className="clip-poster" src={poster} alt="" width={name === 'understory' ? 1900 : 1920} height={name === 'understory' ? 988 : 1080} onLoad={event => { void event.currentTarget.decode().then(() => setPosterReady(true)).catch(() => {}) }} onError={event => { if (!new URL(event.currentTarget.src).pathname.endsWith('/media/forest-final.jpg')) event.currentTarget.src = mediaUrl('/media/forest-final.jpg') }} />
    {enabled && active && <video ref={video} src={mediaUrl(`/media/forest-${name}.mp4`)} muted playsInline preload="auto" tabIndex={-1} />}
    <canvas ref={carrier} className="clip-held" />
  </div>
}
