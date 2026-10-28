import { useId } from 'react'
import { messages } from './i18n'
import type { Locale } from './i18n'
import type { ForestAudio } from './useForestAudio'
export default function SoundControl({ audio, locale }: { audio: ForestAudio; locale: Locale }) {
  const t = messages[locale], id = useId()
  return <button className="sound-control" onClick={audio.toggle} aria-pressed={audio.enabled} aria-label={audio.enabled ? t.muteSound : t.enableSound} aria-describedby={id} data-audio-state={audio.status}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M11 4 5 9H2v6h3l6 5V4Z" />{audio.enabled ? <path d="M15 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14" /> : <path d="m16 9 6 6m0-6-6 6" />}</svg>
    <span>{t.forestSound}</span><span className="sr-only" id={id}>{audio.status === 'playing' ? t.soundPlaying : audio.status === 'waiting' ? t.soundWaiting : audio.status === 'unavailable' ? t.soundUnavailable : t.soundMuted}</span>
  </button>
}
