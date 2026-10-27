import { useEffect, useRef } from 'react'

type Props = { onFinish: (reason: string) => void; onTypography: () => void; skipRequested: boolean }

/** One-shot film. Every exit converges on the same already-rendered final image. */
export default function IntroFilm({ onFinish, onTypography, skipRequested }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const finished = useRef(false)

  useEffect(() => {
    const video = videoRef.current!
    let lastProgress = performance.now()
    let lastTime = 0
    const started = performance.now()
    const finish = (reason: string) => {
      if (finished.current) return
      finished.current = true
      video.pause()
      onFinish(reason)
    }
    const ended = () => finish('ended')
    const error = () => finish('media-error')
    const progress = () => {
      if (video.currentTime > lastTime) {
        lastProgress = performance.now()
        lastTime = video.currentTime
      }
      if (video.currentTime >= 4.5) onTypography()
    }
    const hidden = () => { if (document.hidden) finish('backgrounded') }
    video.addEventListener('ended', ended)
    video.addEventListener('error', error)
    video.addEventListener('timeupdate', progress)
    document.addEventListener('visibilitychange', hidden)
    // Some browsers leave play() pending forever on poor connections.
    const watchdog = window.setInterval(() => {
      const now = performance.now()
      if (now - started > 9500) finish('deadline')
      else if (lastTime > 0 && now - lastProgress > 2400) finish('stalled')
      else if (lastTime === 0 && now - started > 4000) finish('load-timeout')
    }, 250)
    video.muted = true
    const playback = video.play()
    playback?.catch(() => finish('autoplay-blocked'))
    return () => {
      clearInterval(watchdog)
      video.pause()
      video.removeEventListener('ended', ended)
      video.removeEventListener('error', error)
      video.removeEventListener('timeupdate', progress)
      document.removeEventListener('visibilitychange', hidden)
    }
  }, [onTypography, onFinish])

  useEffect(() => {
    if (skipRequested && !finished.current) {
      finished.current = true
      videoRef.current?.pause()
      onFinish('skipped')
    }
  }, [skipRequested, onFinish])

  return <video ref={videoRef} className="forest-film" poster="/media/forest-poster.jpg" muted playsInline autoPlay preload="auto" aria-hidden="true" tabIndex={-1}>
    <source src="/media/forest-reveal.mp4" type="video/mp4" />
  </video>
}
