import { useCallback, useEffect, useRef, useState } from 'react'
import { hasPlayedClip, rememberClip } from './clipHistory'
export type ClipName = 'awakening' | 'understory' | 'breathing'
const posterFor = (name: ClipName) => `/media/forest-${name}${name === 'understory' ? '' : '-poster'}.jpg`
/** Onstage-only, one-shot playback. The final still is decoded beneath the film before it ends. */
export default function MotionClip({ name, enabled, onFinish, skip = false, remember = true }: { name: ClipName; enabled: boolean; onFinish?: (reason: string) => void; skip?: boolean; remember?: boolean }) {
  const [done, setDone] = useState(() => remember && hasPlayedClip(name))
  const [reason, setReason] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const lock = useRef(false)
  const callback = useRef(onFinish)
  useEffect(() => { callback.current = onFinish }, [onFinish])
  const finish = useCallback((why: string) => {
    if (lock.current) return
    lock.current = true; videoRef.current?.pause(); setDone(true); setReason(why); callback.current?.(why)
  }, [])
  useEffect(() => {
    if (skip || !enabled) { if (!done) finish(skip ? 'skipped' : 'preference'); return }
    if (done) return
    const video = videoRef.current
    if (!video) return
    if (remember) rememberClip(name)
    let lastTime = 0, progressAt = performance.now(), activeTime = 0, previous = performance.now()
    const play = () => { progressAt = performance.now(); video.play()?.catch(() => finish('autoplay-blocked')) }
    const visibility = () => { if (document.hidden) video.pause(); else play(); previous = performance.now() }
    const progress = () => { if (video.currentTime > lastTime) { lastTime = video.currentTime; progressAt = performance.now() } }
    const ended = () => finish('ended'), error = () => finish('media-error')
    video.addEventListener('timeupdate', progress); video.addEventListener('ended', ended); video.addEventListener('error', error)
    document.addEventListener('visibilitychange', visibility)
    const timer = setInterval(() => {
      const now = performance.now(); if (!document.hidden) {
        activeTime += now - previous
        if (activeTime > 10000) finish('deadline')
        else if (now - progressAt > (lastTime ? 2400 : 4000)) finish(lastTime ? 'stalled' : 'load-timeout')
      }
      previous = now
    }, 200)
    video.muted = true; if (!document.hidden) play()
    return () => {
      clearInterval(timer); video.pause(); video.removeEventListener('timeupdate', progress); video.removeEventListener('ended', ended); video.removeEventListener('error', error); document.removeEventListener('visibilitychange', visibility)
      video.removeAttribute('src'); video.load()
    }
  }, [name, enabled, done, finish, remember, skip])
  return <div className={`motion-clip clip-${name}`} data-clip={name} data-clip-state={done ? 'complete' : 'playing'} data-clip-reason={reason} aria-hidden="true">
    <img className="clip-end" onError={event => { if (!event.currentTarget.src.endsWith('/media/forest-final.jpg')) event.currentTarget.src = '/media/forest-final.jpg' }} src={`/media/forest-${name}-final.jpg`} alt="" width="1920" height="1080" />
    {!done && <img className="clip-poster" onError={event => { event.currentTarget.style.display = 'none' }} src={posterFor(name)} alt="" width="1920" height="1080" />}
    {enabled && !done && <video ref={videoRef} src={`/media/forest-${name}.mp4`} poster={posterFor(name)} muted playsInline autoPlay preload="auto" tabIndex={-1} />}
  </div>
}
