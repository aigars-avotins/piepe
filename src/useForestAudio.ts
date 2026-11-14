import { useCallback, useEffect, useRef, useState } from 'react'
import { saveData } from './usePreferences'
export type ForestAudio = { enabled: boolean; status: 'waiting' | 'playing' | 'muted' | 'unavailable'; toggle: (event?: { isTrusted: boolean }) => void; activate?: (event?: {isTrusted:boolean})=>void }
type AudioDepth = 'surface' | 'close' | 'beneath'
const frequencyFor = (depth: AudioDepth) => depth==='beneath'?4600:depth==='close'?10000:20000

/** One native, gapless audio graph for the whole journey, including the top-layer note. */
export function useForestAudio(depth: AudioDepth = 'surface'): ForestAudio {
  const [enabled, setEnabled] = useState(true)
  const [status, setStatus] = useState<ForestAudio['status']>('waiting')
  const command = useRef<((trusted: boolean, force?:boolean) => void) | undefined>(undefined)
  const depthValue = useRef(frequencyFor(depth)), graph = useRef<{ context: AudioContext; filter?: BiquadFilterNode } | undefined>(undefined)
  useEffect(() => {
    depthValue.current=frequencyFor(depth)
    const current=graph.current
    if(current?.filter&&current.context.state!=='closed') {
      current.filter.frequency.cancelScheduledValues(current.context.currentTime)
      current.filter.frequency.setTargetAtTime(depthValue.current,current.context.currentTime,1.2)
    }
  },[depth])
  useEffect(() => {
    let desired = true, alive = true, activated = false, context: AudioContext | undefined, gain: GainNode | undefined, filter: BiquadFilterNode | undefined, source: AudioBufferSourceNode | undefined
    let buffer: Promise<AudioBuffer> | undefined, pauseTimer: ReturnType<typeof setTimeout> | undefined, recording: HTMLAudioElement | undefined
    // Resolve mute before installing gesture listeners, including very early interactions.
    let stored: string | null = null
    try { stored = localStorage.getItem('piepe-forest-sound') } catch { /* Preference remains in memory. */ }
    desired = stored !== 'off' && (stored === 'on' || !saveData())
    const abort = new AbortController()
    const silence = () => {
      clearTimeout(pauseTimer)
      recording?.pause()
      if (!context || !gain) return
      gain.gain.cancelScheduledValues(context.currentTime)
      gain.gain.setTargetAtTime(0, context.currentTime, .04)
      pauseTimer = setTimeout(() => { void context?.suspend().catch(() => {}) }, 180)
    }
    const start = async () => {
      if (!alive || !desired || !activated || document.hidden) return
      clearTimeout(pauseTimer)
      try {
        if (!context && !recording) {
          const AudioContextType = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
          try {
            if (!AudioContextType) throw Error('Web Audio unavailable')
            context = new AudioContextType(); gain = context.createGain(); gain.gain.value = 0; gain.connect(context.destination)
          } catch {
            void context?.close().catch(() => {});context=undefined;gain=undefined
            // The same user-approved recording remains available without Web Audio.
            recording=new window.Audio('/audio/forest-ambience.mp3');recording.preload='none';recording.loop=true;recording.volume=.22
          }
          if(context) {
            try {
              filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=depthValue.current;filter.Q.value=.35;filter.connect(gain!)
            } catch { filter?.disconnect();filter=undefined /* The original recording still has its original unfiltered graph. */ }
            graph.current={context,filter}
          }
        }
        if(recording) {
          if(recording.error)recording.load()
          await recording.play()
          if(!alive||!desired||document.hidden){recording.pause();return}
          setStatus('playing');return
        }
        // Call resume synchronously in the gesture handler. A suspended autoplay attempt may stay pending.
        await context!.resume()
        if (!alive || !desired || document.hidden) return
        if (!buffer) buffer = fetch('/audio/forest-ambience.mp3', { signal: abort.signal }).then(response => {
          if (!response.ok) throw Error('Audio unavailable')
          return response.arrayBuffer()
        }).then(bytes => context!.decodeAudioData(bytes)).catch(error => { buffer = undefined; throw error })
        const decoded = await buffer
        if (!alive || !desired || document.hidden) return
        if (!source) { source = context!.createBufferSource(); source.buffer = decoded; source.loop = true; source.connect(filter||gain!); source.start() }
        gain!.gain.cancelScheduledValues(context!.currentTime)
        gain!.gain.setTargetAtTime(.22, context!.currentTime, .6)
        setStatus('playing')
      } catch (error) {
        if (!alive || !desired || (error instanceof DOMException && error.name === 'AbortError')) return
        // Autoplay rejection is a waiting state; the next real interaction retries the same graph.
        if (error instanceof DOMException && error.name === 'NotAllowedError') { setStatus('waiting'); return }
        desired = false; setEnabled(false); setStatus('unavailable')
      }
    }
    command.current = (trusted,force) => {
      activated ||= trusted || !!navigator.userActivation?.isActive
      desired = force??!desired; setEnabled(desired); setStatus(desired ? 'waiting' : 'muted')
      try { localStorage.setItem('piepe-forest-sound', desired ? 'on' : 'off') } catch { /* Preference works for this visit without storage. */ }
      if (desired) void start(); else silence()
    }
    const interaction = (event: Event) => {
      if (!event.isTrusted) return
      if (event.target instanceof Element && (event.target.closest('.sound-control')||event.target.closest('.fungus-portal,[data-portal-entry],[data-portal-hero-entry]'))) return
      activated=true
      if (desired && (recording?recording.paused:!context || context.state !== 'running' || !source)) void start()
    }
    const visibility = () => { if (document.hidden) silence(); else if (desired) void start() }
    document.addEventListener('pointerdown', interaction, { passive: true })
    document.addEventListener('click', interaction)
    document.addEventListener('keydown', interaction)
    document.addEventListener('visibilitychange', visibility)
    const initialize = () => {
      setEnabled(desired); setStatus(desired ? source && context?.state==='running'?'playing':'waiting' : 'muted')
      // A remembered preference is not a fresh gesture. Create no audio context or request yet.
    }
    const frame = requestAnimationFrame(initialize)
    return () => {
      alive = false; command.current = undefined; cancelAnimationFrame(frame); clearTimeout(pauseTimer); abort.abort()
      document.removeEventListener('pointerdown', interaction); document.removeEventListener('click', interaction); document.removeEventListener('keydown', interaction); document.removeEventListener('visibilitychange', visibility)
      graph.current=undefined;source?.stop(); source?.disconnect(); filter?.disconnect(); gain?.disconnect(); void context?.close().catch(() => {})
      if(recording){recording.pause();recording.removeAttribute('src');recording.load()}
    }
  }, [])
  return { enabled, status, toggle: useCallback((event?: { isTrusted: boolean }) => command.current?.(!!event?.isTrusted), []), activate:useCallback((event?:{isTrusted:boolean})=>command.current?.(!!event?.isTrusted,true),[]) }
}
