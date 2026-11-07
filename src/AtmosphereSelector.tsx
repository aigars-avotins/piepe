import { useSyncExternalStore } from 'react'
import type { Locale } from './i18n'
import { atmosphereLabels, atmosphereSnapshot, morningSnapshot, setAtmosphere, subscribeAtmosphere } from './atmosphere'

const subscribeReady = () => () => {}, clientReady = () => true, serverReady = () => false
export default function AtmosphereSelector({ locale }: { locale: Locale }) {
  const t=atmosphereLabels[locale], selected=useSyncExternalStore(subscribeAtmosphere,atmosphereSnapshot,morningSnapshot)
  const ready=useSyncExternalStore(subscribeReady,clientReady,serverReady)
  return <fieldset className="atmosphere-controls" hidden={!ready} data-atmosphere-controls><legend>{t.label}</legend>{(['morning','nightfall'] as const).map(value=><button key={value} type="button" data-atmosphere-choice={value} aria-pressed={selected===value} onClick={()=>setAtmosphere(value)}><span data-nosnippet="">{t[value]}</span></button>)}</fieldset>
}
