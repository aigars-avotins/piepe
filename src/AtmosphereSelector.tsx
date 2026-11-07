import { useSyncExternalStore } from 'react'
import type { Locale } from './i18n'
import { atmosphereLabels, atmosphereSnapshot, morningSnapshot, setAtmosphere, subscribeAtmosphere } from './atmosphere'

const subscribeReady = () => () => {}, clientReady = () => true, serverReady = () => false
export default function AtmosphereSelector({ locale }: { locale: Locale }) {
  const t=atmosphereLabels[locale], selected=useSyncExternalStore(subscribeAtmosphere,atmosphereSnapshot,morningSnapshot)
  const ready=useSyncExternalStore(subscribeReady,clientReady,serverReady)
  return <fieldset className="atmosphere-controls" data-atmosphere-controls><legend>{t.label}</legend>{(['morning','nightfall'] as const).map(value=><button key={value} type="button" disabled={!ready} data-atmosphere-choice={value} aria-pressed={selected===value} onClick={()=>setAtmosphere(value)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">{value==='morning'?<><circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/></>:<path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/>}</svg><span data-nosnippet="">{t[value]}</span></button>)}</fieldset>
}
