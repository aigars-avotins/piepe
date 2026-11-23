import SiteLink from './SiteLink'
import { renderToStaticMarkup } from 'react-dom/server'
import { localePath, messages, readingPath } from './i18n'
import type { Locale } from './i18n'
import { fieldNotesPath, wallpapersPath } from './forestPaths'
import { releaseVersion, releaseMilestone } from './release'
import { DocumentHead } from './documentHead'
import { AttentionLight, SiteMenu } from './SiteChrome'

// One static document answers every unknown URL, so both languages share it:
// the address alone cannot say which visitor arrived.
export const notFoundCopy: Record<Locale, { label: string; heading: string; body: string; home: string; guide: string; notes: string; wallpapers: string; navigation: string }> = {
  lv: { label: '404 / Taka beidzas', heading: 'Šeit mežs apklust.', body: 'Meklētā lapa nav atrodama. Varbūt tā ir pārcelta, varbūt šajā vietā nekad nav augusi.', home: 'Atgriezties dzīvajā mežā', guide: 'Kas ir piepe?', notes: 'Meža piezīmes', wallpapers: 'Meža foni', navigation: 'Citas takas' },
  en: { label: '404 / The trail ends', heading: 'Here the forest goes quiet.', body: 'The page you were looking for cannot be found. It may have moved, or it never grew in this spot.', home: 'Return to the living forest', guide: 'What is a bracket fungus?', notes: 'Field notes', wallpapers: 'Forest wallpapers', navigation: 'Other trails' },
}

export function renderNotFoundDocument(stylesheets: string[], fonts: string[], client?: string) {
  return '<!doctype html>\n' + renderToStaticMarkup(<html lang="lv" className="reading-document">
    <DocumentHead locale="lv" title="PIE.PE — 404 · Taka beidzas / The trail ends" stylesheets={stylesheets} fonts={fonts} client={client} noindex />
    <body className="reading-page not-found-page" data-version={releaseVersion} data-milestone={releaseMilestone}>
      <AttentionLight />
      <SiteLink className="skip-content" href="#not-found">{messages.lv.skipContent}</SiteLink>
      <header className="reading-header">
        <SiteLink className="brand" href="/" aria-label={messages.lv.homeLabel}><img src="/brand-mark.svg" alt="" width="40" height="40" /><img className="brand-wordmark" src="/brand-wordmark.svg" alt="pie.pe" width="64" height="34" /></SiteLink>
        <nav className="reading-languages" aria-label={`${messages.lv.language} / ${messages.en.language}`}>{(['lv', 'en'] as const).map(lang => <SiteLink key={lang} lang={lang} hrefLang={lang} href={localePath(lang)}>{lang.toUpperCase()}</SiteLink>)}</nav>
      </header>
      <main id="not-found" className="reading-main not-found" tabIndex={-1}>
        <span className="not-found-light" aria-hidden="true" />
        {(['lv', 'en'] as const).map(locale => { const t = notFoundCopy[locale]; return <section key={locale} lang={locale} aria-labelledby={`not-found-${locale}`}>
          <p className="reading-label">{t.label}</p>
          <h1 id={`not-found-${locale}`}>{t.heading}</h1>
          <p className="reading-lead">{t.body}</p>
          <p className="not-found-home"><SiteLink href={localePath(locale)}>{t.home}<span aria-hidden="true"> ↗</span></SiteLink></p>
          <nav aria-label={t.navigation}><SiteLink href={readingPath(locale)}>{t.guide}</SiteLink><SiteLink href={fieldNotesPath(locale)}>{t.notes}</SiteLink><SiteLink href={wallpapersPath(locale)}>{t.wallpapers}</SiteLink></nav>
        </section> })}
      </main>
      <SiteMenu locale="lv" current="none" alternate={{ lv: localePath('lv'), en: localePath('en') }} />
    </body>
  </html>)
}
