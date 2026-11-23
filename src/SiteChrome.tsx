import type { MouseEvent, ReactNode } from 'react'
import SiteLink from './SiteLink'
import { localePath, messages, readingPath } from './i18n'
import type { Locale } from './i18n'
import { fieldNotesPath, wallpapersPath } from './forestPaths'
import { aboutPath } from './routes'
import { siteCopy } from './siteCopy'
import { releaseMilestone } from './release'

export type SiteSection = 'home' | 'guide' | 'notes' | 'wallpapers' | 'about' | 'none'
const destinations = (locale: Locale) => [
  ['home', localePath(locale)], ['guide', readingPath(locale)], ['notes', fieldNotesPath(locale)], ['wallpapers', wallpapersPath(locale)], ['about', aboutPath(locale)],
] as const

/** One quiet way to every page and both languages, identical on the cinema, reading pages and inside the portal.
 *  Native <details>: it works without JavaScript; siteMenu.ts adds Escape and outside-press closing. */
export function SiteMenu({ locale, current, alternate, onLocale, className = '' }: {
  locale: Locale; current: SiteSection; alternate: Record<Locale, string>; onLocale?: (locale: Locale, event: MouseEvent<HTMLAnchorElement>) => void; className?: string
}) {
  const t = siteCopy[locale].menu
  return <details className={`site-menu ${className}`} data-site-menu>
    <summary aria-label={t.open}><span className="site-menu-light" aria-hidden="true" /><span className="site-menu-label" data-nosnippet="">{t.label}</span></summary>
    <div className="site-menu-panel">
      <nav aria-label={t.label}><ol>{destinations(locale).map(([key, href], index) => <li key={key}>
        <SiteLink href={href} aria-current={current === key ? 'page' : undefined}><span className="site-menu-number" aria-hidden="true">{String(index).padStart(2, '0')}</span><span data-nosnippet="">{t.items[key]}</span></SiteLink>
      </li>)}</ol></nav>
      <p className="site-menu-languages"><span data-nosnippet="">{t.languages}</span>{(['lv', 'en'] as const).map(value => <SiteLink key={value} href={alternate[value]} lang={value} hrefLang={value} aria-current={value === locale ? 'true' : undefined} onClick={onLocale ? event => onLocale(value, event) : undefined}><span data-nosnippet="">{value.toUpperCase()}</span></SiteLink>)}</p>
    </div>
  </details>
}

/** The same closing page everywhere: a thought, three short lists, the honest note about the imagery. */
export function SiteFooter({ locale, current, onHome, children }: { locale: Locale; current: SiteSection; onHome?: () => void; children?: ReactNode }) {
  const t = siteCopy[locale], home = localePath(locale)
  const link = (key: SiteSection, href: string, label: string) => <li><SiteLink href={href} aria-current={current === key ? 'page' : undefined}>{label}</SiteLink></li>
  return <footer className="site-footer" data-site-footer>
    <div className="site-footer-lead"><p className="site-footer-thought">{t.footer.thought}</p><p className="site-footer-meaning"><span lang="lv">{t.footer.meaning.split(' — ')[0]}</span> — {t.footer.meaning.split(' — ')[1]}</p></div>
    <nav className="site-footer-nav" aria-label={t.menu.label + ' — ' + messages[locale].forest}>
      <div><h2>{t.footer.forest}</h2><ul>{link('home', home, t.menu.items.home)}<li><SiteLink href={(current === 'home' ? '' : home) + '#encounter'}>{t.footer.portal}</SiteLink></li>{link('wallpapers', wallpapersPath(locale), t.menu.items.wallpapers)}</ul></div>
      <div><h2>{t.footer.read}</h2><ul>{link('guide', readingPath(locale), t.menu.items.guide)}{link('notes', fieldNotesPath(locale), t.menu.items.notes)}</ul></div>
      <div><h2>{t.footer.about}</h2><ul>{link('about', aboutPath(locale), t.menu.items.about)}</ul><p className="site-footer-art">{t.footer.art}</p></div>
    </nav>
    <div className="site-footer-base">
      <SiteLink className="brand" href={current === 'home' ? '#forest' : home} onClick={onHome} aria-label={messages[locale].homeLabel}><img src="/brand-mark.svg" alt="" width="40" height="40" /><img className="brand-wordmark" src="/brand-wordmark.svg" alt="pie.pe" width="64" height="34" /></SiteLink>
      <span className="footer-edition">{messages[locale].forest} — 2026 · {t.footer.edition} {releaseMilestone}</span>
      {children}
    </div>
  </footer>
}

/** A fixed, decorative light that siteMenu.ts moves with a fine pointer. */
export const AttentionLight = () => <span className="attention-light" data-attention-light aria-hidden="true" />

