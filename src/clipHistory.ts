import { readSession, writeSession } from './usePreferences'
// Keep once-per-page behavior even when private browsing disables sessionStorage.
const played = new Set<string>()
export const hasPlayedClip = (name: string) => played.has(name) || readSession(`piepe-${name}`)
export function rememberClip(name: string) { played.add(name); writeSession(`piepe-${name}`) }
