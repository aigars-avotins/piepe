import { useCallback, useEffect, useRef, useState } from 'react'
import { hasPlayedClip, rememberClip } from './clipHistory'
import EnvironmentalFilm from './EnvironmentalFilm'
import { mediaUrl } from './mediaUrl'
export type ClipName = 'awakening' | 'understory' | 'breathing'
const posterFor = (name: ClipName) => mediaUrl(`/media/forest-${name}${name === 'understory' ? '' : '-poster'}.jpg`)
type Props = { name: ClipName; enabled: boolean; active?: boolean; onReady?: () => void; onFinish?: (reason: string) => void; remember?: boolean }
/** Decode behind the held source frame; expose only an actually presented video frame. */
export default function MotionClip(props: Props) {
  if (props.name !== 'awakening') return <EnvironmentalFilm key={`${props.name}-${props.enabled}-${props.active ?? true}`} {...props} name={props.name} />
  return <AwakeningClip {...props} />
}
function AwakeningClip({ name, enabled, active = true, onReady, onFinish, remember = true }: Props) {
  const [done, setDone] = useState(() => remember && hasPlayedClip(name))
  const [ready, setReady] = useState(false)
  const [stillReady, setStillReady] = useState(false)
  const [endReady, setEndReady] = useState(false)
  const [reason, setReason] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null), endRef = useRef<HTMLImageElement>(null)
  const alive = useRef(true)
  useEffect(() => { alive.current = true; return () => { alive.current = false } }, [])
  const lock = useRef(false), started = useRef(false), callbacks = useRef({ onReady, onFinish })
  useEffect(() => { callbacks.current = { onReady, onFinish } }, [onReady, onFinish])
  const finish = useCallback((why: string) => {
    if (lock.current) return
    lock.current = true
    videoRef.current?.pause()
    // Retain the decoded video until the exact held still is available, never expose an empty frame.
    let completed = false
    const complete = (reason = why) => { if (completed || !alive.current) return; completed = true; setDone(true); setReason(reason); callbacks.current.onFinish?.(reason) }
    const image = endRef.current
    if (why === 'ended' && (image?.dataset.fallback || (image?.complete && !image.naturalWidth))) complete('still-error')
    else if (why === 'ended' && image && !image.complete) {
      const timeout = setTimeout(() => complete('still-timeout'), 1500)
      image.decode().then(() => { clearTimeout(timeout); complete(image.dataset.fallback ? 'still-error' : why) }, () => { clearTimeout(timeout); complete('still-error') })
    }
    else complete()
  }, [])
  useEffect(() => {
    // A concurrent/remounted activation can observe history written by the first
    // instance. Complete that activation too, so its parent cannot stay preparing.
    if (done) { if (!lock.current) finish('already-played'); return }
    if (!enabled) { finish('preference'); return }
    if (!active) { if (started.current) finish('offstage'); return }
    const video = videoRef.current
    if (!video) return
    started.current = true
    if (remember) rememberClip(name)
    let lastTime = 0, progressAt = performance.now(), activeTime = 0, previous = performance.now(), revealed = false, frame = 0, paint = 0
    const play = () => { progressAt = performance.now(); video.play()?.catch(() => { if (!lock.current) finish('autoplay-blocked') }) }
    const present = () => {
      if (revealed || lock.current || !alive.current) return
      // A paused first frame can be presented just before readyState advances. There is
      // no second frame callback until playback, so recheck readiness on the next paint.
      if (video.readyState < 2) { paint = requestAnimationFrame(present); return }
      revealed = true; setReady(true); callbacks.current.onReady?.()
      // Commit the exact source opening before advancing the decoder's clock.
      paint = requestAnimationFrame(() => { paint = requestAnimationFrame(() => { if (!document.hidden && !lock.current) play() }) })
    }
    const decoded = () => {
      if (video.requestVideoFrameCallback) frame = video.requestVideoFrameCallback(present)
      else frame = requestAnimationFrame(present)
    }
    const visibility = () => { if (document.hidden) video.pause(); else if (revealed) play(); previous = performance.now() }
    const progress = () => { if (video.currentTime > lastTime) { lastTime = video.currentTime; progressAt = performance.now() } }
    const ended = () => finish('ended'), error = () => finish('media-error')
    video.addEventListener('timeupdate', progress); video.addEventListener('ended', ended); video.addEventListener('error', error)
    document.addEventListener('visibilitychange', visibility)
    const timer = setInterval(() => {
      const now = performance.now()
      if (!document.hidden) {
        activeTime += now - previous
        if (activeTime > 10000) finish('deadline')
        else if (now - progressAt > (lastTime ? 2400 : 4000)) finish(lastTime ? 'stalled' : 'load-timeout')
      }
      previous = now
    }, 200)
    video.muted = true
    // Subscribe before assigning the source: preload may present frame zero before
    // loadeddata. Playing merely to obtain readiness would skip that opening frame.
    if (typeof video.requestVideoFrameCallback === 'function') decoded()
    else video.addEventListener('loadeddata', decoded, { once: true })
    video.src = mediaUrl(`/media/forest-${name}.mp4`)
    return () => {
      clearInterval(timer); video.pause(); video.removeEventListener('loadeddata', decoded); video.removeEventListener('timeupdate', progress); video.removeEventListener('ended', ended); video.removeEventListener('error', error); document.removeEventListener('visibilitychange', visibility)
      if (video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(frame); else cancelAnimationFrame(frame)
      cancelAnimationFrame(paint)
      video.removeAttribute('src'); video.load()
    }
  }, [name, enabled, active, done, finish, remember])
  return <div className={`motion-clip clip-${name}`} data-clip={name} data-clip-state={done ? 'complete' : ready ? 'playing' : 'preparing'} data-clip-ready={ready} data-still-ready={done ? endReady : stillReady} data-clip-reason={reason} aria-hidden="true">
    <img ref={endRef} className="clip-end" onLoad={event => { void event.currentTarget.decode().then(() => { if (alive.current) setEndReady(true) }).catch(() => {}) }} onError={event => { event.currentTarget.dataset.fallback = 'true'; if (!new URL(event.currentTarget.src).pathname.endsWith('/media/forest-final.jpg')) event.currentTarget.src = mediaUrl('/media/forest-final.jpg') }} src={mediaUrl(`/media/forest-${name}-final.jpg`)} alt="" width="1920" height="1080" />
    {!done && name !== 'awakening' && <img className="clip-poster" onLoad={event => { void event.currentTarget.decode().then(() => { if (alive.current) setStillReady(true) }).catch(() => {}) }} onError={event => { event.currentTarget.style.display = 'none' }} src={posterFor(name)} alt="" width="1920" height="1080" />}
    {enabled && active && !done && <video ref={videoRef} muted playsInline preload="auto" tabIndex={-1} />}
  </div>
}
