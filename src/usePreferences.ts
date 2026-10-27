import { useSyncExternalStore } from 'react'
const query = '(prefers-reduced-motion: reduce)'
const subscribe = (callback: () => void) => {
  const media = matchMedia(query)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}
export const useReducedMotion = () => useSyncExternalStore(subscribe, () => matchMedia(query).matches)
export function saveData() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  return !!connection?.saveData || ['2g', 'slow-2g'].includes(connection?.effectiveType || '')
}
export function readSession(key: string) {
  try { return sessionStorage.getItem(key) === '1' } catch { return false }
}
export function writeSession(key: string) {
  try { sessionStorage.setItem(key, '1') } catch { /* Private browsing may disable storage. */ }
}
