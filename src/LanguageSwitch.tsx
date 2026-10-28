import { localePath, messages } from './i18n'
import type { Locale } from './i18n'
export default function LanguageSwitch({ locale, onChange }: { locale: Locale; onChange?: (locale: Locale) => void }) {
  return <nav className="language-switch" aria-label={messages[locale].language}>{(['lv', 'en'] as const).map(value => <a key={value} href={localePath(value)} lang={value} hrefLang={value} aria-current={value === locale ? 'page' : undefined} onClick={event => {
    if (!onChange || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault(); onChange(value)
  }}>{value.toUpperCase()}</a>)}</nav>
}
