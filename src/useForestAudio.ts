import { useCallback, useEffect, useRef, useState } from 'react'
import { saveData } from './usePreferences'
export type ForestAudio = { enabled: boolean; status: 'waiting' | 'playing' | 'muted' | 'unavailable'; toggle: () => void }

/** One native, gapless audio graph for the whole journey, including the top-layer note. */
export function useForestAudio(): ForestAudio {
  const [enabled, setEnabled] = useState(true)
  const [status, setStatus] = useState<ForestAudio['status']>('waiting')
  const command = useRef<(() => void) | undefined>(undefined)
  useEffect(() => {
    let desired = true, alive = true, context: AudioContext | undefined, gain: GainNode | undefined, source: AudioBufferSourceNode | undefined
    let buffer: Promise<AudioBuffer> | undefined, pauseTimer: ReturnType<typeof setTimeout> | undefined
    const abort = new AbortController()
    const silence = () => {
      clearTimeout(pauseTimer)
      if (!context || !gain) return
      gain.gain.cancelScheduledValues(context.currentTime)
      gain.gain.setTargetAtTime(0, context.currentTime, .04)
      pauseTimer = setTimeout(() => { void context?.suspend().catch(() => {}) }, 180)
    }
    const start = async () => {
      if (!alive || !desired || document.hidden) return
      clearTimeout(pauseTimer)
      try {
        if (!context) {
          const Audio = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
          if (!Audio) throw Error('Audio unavailable')
          context = new Audio(); gain = context.createGain(); gain.gain.value = 0; gain.connect(context.destination)
        }
        // Call resume synchronously in the gesture handler. A suspended autoplay attempt may stay pending.
        await context.resume()
        if (!alive || !desired || document.hidden) return
        if (!buffer) buffer = fetch('/audio/forest-ambience.mp3', { signal: abort.signal }).then(response => {
          if (!response.ok) throw Error('Audio unavailable')
          return response.arrayBuffer()
        }).then(bytes => context!.decodeAudioData(bytes)).catch(error => { buffer = undefined; throw error })
        const decoded = await buffer
        if (!alive || !desired || document.hidden) return
        if (!source) { source = context.createBufferSource(); source.buffer = decoded; source.loop = true; source.connect(gain!); source.start() }
        gain!.gain.cancelScheduledValues(context.currentTime)
        gain!.gain.setTargetAtTime(.22, context.currentTime, .6)
        setStatus('playing')
      } catch (error) {
        if (!alive || !desired || (error instanceof DOMException && error.name === 'AbortError')) return
        // Autoplay rejection is a waiting state; the next real interaction retries the same graph.
        if (error instanceof DOMException && error.name === 'NotAllowedError') { setStatus('waiting'); return }
        desired = false; setEnabled(false); setStatus('unavailable')
      }
    }
    command.current = () => {
      desired = !desired; setEnabled(desired); setStatus(desired ? 'waiting' : 'muted')
      try { localStorage.setItem('piepe-forest-sound', desired ? 'on' : 'off') } catch { /* Preference works for this visit without storage. */ }
      if (desired) void start(); else silence()
    }
    const interaction = (event: Event) => {
      if (event.target instanceof Element && event.target.closest('.sound-control')) return
      if (desired && (!context || context.state !== 'running' || !source)) void start()
    }
    const visibility = () => { if (document.hidden) silence(); else if (desired) void start() }
    document.addEventListener('pointerdown', interaction, { passive: true })
    document.addEventListener('click', interaction)
    document.addEventListener('keydown', interaction)
    document.addEventListener('visibilitychange', visibility)
    const initialize = () => {
      let stored: string | null = null
      try { stored = localStorage.getItem('piepe-forest-sound') } catch { /* Storage can be unavailable. */ }
      desired = stored !== 'off' && (stored === 'on' || !saveData())
      setEnabled(desired); setStatus(desired ? 'waiting' : 'muted')
      if (desired) void start()
    }
    const frame = requestAnimationFrame(initialize)
    return () => {
      alive = false; command.current = undefined; cancelAnimationFrame(frame); clearTimeout(pauseTimer); abort.abort()
      document.removeEventListener('pointerdown', interaction); document.removeEventListener('click', interaction); document.removeEventListener('keydown', interaction); document.removeEventListener('visibilitychange', visibility)
      source?.stop(); source?.disconnect(); gain?.disconnect(); void context?.close().catch(() => {})
    }
  }, [])
  return { enabled, status, toggle: useCallback(() => command.current?.(), []) }
}
