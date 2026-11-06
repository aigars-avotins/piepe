import type { Locale } from './i18n'

export const noteNumbers = ['001', '002', '003', '004', '005', '006'] as const
export type NoteNumber = typeof noteNumbers[number]
const slugs: Record<NoteNumber, Record<Locale, string>> = {
  '001': { lv: '001', en: '001' },
  '002': { lv: '002-caga', en: '002-chaga' },
  '003': { lv: '003-serpiepe', en: '003-chicken-of-the-woods' },
  '004': { lv: '004-latvijas-piepes', en: '004-common-bracket-fungi' },
  '005': { lv: '005-kritalas-un-laiks', en: '005-deadwood-and-time' },
  '006': { lv: '006-lakas-plakanpiepe', en: '006-lacquered-bracket' },
}
export const wallpapersPath = (locale: Locale) => locale === 'lv' ? '/meza-foni/' : '/en/forest-wallpapers/'
export const fieldNotesPath = (locale: Locale) => locale === 'lv' ? '/meza-piezimes/' : '/en/field-notes/'
export const forestNavigation = {
  lv: { notes: 'Lasīt Meža piezīmes', wallpapers: 'Meža foni: visi izmēri' },
  en: { notes: 'Read the field notes', wallpapers: 'Forest wallpapers: all sizes' },
}
export const notePath = (locale: Locale, number: NoteNumber) => `${fieldNotesPath(locale)}${slugs[number][locale]}/`
export type ForestPage = { kind: 'wallpapers' } | { kind: 'index' } | { kind: 'note'; number: NoteNumber }
export const forestPages: ForestPage[] = [{ kind: 'wallpapers' }, { kind: 'index' }, ...noteNumbers.map(number => ({ kind: 'note' as const, number }))]
export const forestPath = (locale: Locale, page: ForestPage) => page.kind === 'note' ? notePath(locale, page.number) : page.kind === 'wallpapers' ? wallpapersPath(locale) : fieldNotesPath(locale)
