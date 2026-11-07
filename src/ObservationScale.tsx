import type { Locale } from './i18n'
const copy = {
  lv: { label:'Skatiena mērogs', note:'Mākslinieciska perspektīva, ne palielinājuma mērījums.', forest:'Koks un mežs', understory:'Sīkas virsmas', encounter:'Piepe un apslēptais', return:'Atkal plašāk' },
  en: { label:'A scale of attention', note:'An artistic perspective, not a measurement of magnification.', forest:'Tree and forest', understory:'Small surfaces', encounter:'Bracket and beneath', return:'A wider view again' },
}
export default function ObservationScale({ locale, scene }: { locale: Locale; scene: string }) {
  const t=copy[locale], key=['forest','understory','encounter','return'].includes(scene)?scene as 'forest'|'understory'|'encounter'|'return':'forest'
  return <p className="journey-perspective" data-scale-scene={key}><span>{t.label}</span><strong>{t[key]}</strong><small>{t.note}</small></p>
}
