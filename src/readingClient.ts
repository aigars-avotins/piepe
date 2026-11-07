import { bindImageFallback, bindXray, bindAtlas, bindTimeCapsule } from './experienceControls'
// Progressive controls for static documents. No router, React, video or audio runtime.
const themeRoot=document.documentElement
function restoreStaticAtmosphere() {
  try { themeRoot.dataset.atmosphere=localStorage.getItem('piepe-atmosphere')==='nightfall'?'nightfall':'morning' } catch { /* Keep this visit's choice. */ }
  const selected=themeRoot.dataset.atmosphere==='nightfall'?'nightfall':'morning'
  document.querySelectorAll<HTMLButtonElement>('[data-atmosphere-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.atmosphereChoice===selected)))
}
document.querySelectorAll<HTMLElement>('[data-atmosphere-controls]').forEach(controls=>{
  controls.querySelectorAll<HTMLButtonElement>('[data-atmosphere-choice]').forEach(button=>button.addEventListener('click',()=>{
    const value=button.dataset.atmosphereChoice==='nightfall'?'nightfall':'morning'
    themeRoot.dataset.atmosphere=value
    try { localStorage.setItem('piepe-atmosphere',value) } catch { /* Still usable with storage denied. */ }
    controls.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)))
  }))
  controls.querySelectorAll<HTMLButtonElement>('button').forEach(button=>{button.disabled=false})
})
restoreStaticAtmosphere();window.addEventListener('storage',restoreStaticAtmosphere);window.addEventListener('pageshow',restoreStaticAtmosphere)
const connection=(navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string; addEventListener?: (type: string, callback: () => void) => void } }).connection
const staticPreferences=()=>themeRoot.toggleAttribute('data-save-data',!!connection?.saveData||['2g','slow-2g'].includes(connection?.effectiveType||''))
staticPreferences();connection?.addEventListener?.('change',staticPreferences)

bindImageFallback(document)
document.querySelectorAll<HTMLElement>('[data-xray]').forEach(bindXray)
document.querySelectorAll<HTMLElement>('[data-atlas]').forEach(bindAtlas)
document.querySelectorAll<HTMLElement>('[data-time-capsule]').forEach(bindTimeCapsule)
export {}
