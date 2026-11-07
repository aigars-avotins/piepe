import type { Locale } from './i18n'

export type Atmosphere = 'morning' | 'nightfall'
export const atmosphereLabels: Record<Locale, { label: string; morning: string; nightfall: string }> = {
  lv: { label: 'Krāsu noskaņa', morning: 'Rīta gaisma', nightfall: 'Nakts krēsla' },
  en: { label: 'Colour atmosphere', morning: 'Morning light', nightfall: 'Nightfall' },
}
// Shared, hash-authorized prepaint code: whitelist only a manual colour preference.
export const atmosphereBootstrap = "(()=>{try{document.documentElement.dataset.atmosphere=localStorage.getItem('piepe-atmosphere')==='nightfall'?'nightfall':'morning'}catch{}})();"
export const morningSnapshot = (): Atmosphere => 'morning'
export const atmosphereSnapshot = (): Atmosphere => document.documentElement.dataset.atmosphere==='nightfall'?'nightfall':'morning'
export function setAtmosphere(value: Atmosphere) {
  document.documentElement.dataset.atmosphere=value
  try { localStorage.setItem('piepe-atmosphere',value) } catch { /* This visit still has its selected colours. */ }
  window.dispatchEvent(new Event('piepe:atmosphere'))
}
export function subscribeAtmosphere(notify: () => void) {
  const restore=()=>{
    try { document.documentElement.dataset.atmosphere=localStorage.getItem('piepe-atmosphere')==='nightfall'?'nightfall':'morning' } catch { /* Retain the in-memory choice. */ }
    notify()
  }
  window.addEventListener('piepe:atmosphere',notify);window.addEventListener('storage',restore);window.addEventListener('pageshow',restore)
  return()=>{window.removeEventListener('piepe:atmosphere',notify);window.removeEventListener('storage',restore);window.removeEventListener('pageshow',restore)}
}
