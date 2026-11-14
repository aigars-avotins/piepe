import { bindImageFallback, bindXray, bindAtlas, bindTimeCapsule } from './experienceControls'
// Progressive controls for static documents. No router, React, video or audio runtime.
const themeRoot=document.documentElement
// Retire the old preference without restoring a selectable colour mode.
try { localStorage.removeItem('piepe-atmosphere') } catch { /* Storage is optional. */ }
const connection=(navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string; addEventListener?: (type: string, callback: () => void) => void } }).connection
const staticPreferences=()=>themeRoot.toggleAttribute('data-save-data',!!connection?.saveData||['2g','slow-2g'].includes(connection?.effectiveType||''))
staticPreferences();connection?.addEventListener?.('change',staticPreferences)

bindImageFallback(document)
document.querySelectorAll<HTMLElement>('[data-xray]').forEach(bindXray)
document.querySelectorAll<HTMLElement>('[data-atlas]').forEach(bindAtlas)
document.querySelectorAll<HTMLElement>('[data-time-capsule]').forEach(bindTimeCapsule)
export {}
