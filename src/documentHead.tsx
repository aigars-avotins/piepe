import type { Locale } from './i18n'
import type { RouteKey } from './routes'
import { siteOrigin, siteRoute, socialImage } from './routes'

/** The shared <head> of every prerendered document: one title, one description, one canonical, its own social image. */
export function DocumentHead({ route, locale, title, description, type = 'website', imageAlt, schema, stylesheets, fonts, client, noindex = false }: {
  route?: RouteKey; locale: Locale; title: string; description?: string; type?: 'website' | 'article'; imageAlt?: string; schema?: object; stylesheets: string[]; fonts: string[]; client?: string; noindex?: boolean
}) {
  const paths = route && siteRoute(route).paths, url = paths && siteOrigin + paths[locale], image = route && siteOrigin + socialImage(route, locale)
  return <head>
    <meta charSet="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" /><meta name="theme-color" content="#0B1712" />
    {noindex && <meta name="robots" content="noindex" />}
    <title>{title}</title>{description && <meta name="description" content={description} />}
    {paths && <><link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="lv" href={siteOrigin + paths.lv} /><link rel="alternate" hrefLang="en" href={siteOrigin + paths.en} /><link rel="alternate" hrefLang="x-default" href={siteOrigin + paths.lv} />
      <meta property="og:type" content={type} /><meta property="og:site_name" content="PIE.PE" /><meta property="og:title" content={title} /><meta property="og:description" content={description} /><meta property="og:url" content={url} />
      <meta property="og:locale" content={locale === 'lv' ? 'lv_LV' : 'en_GB'} /><meta property="og:locale:alternate" content={locale === 'lv' ? 'en_GB' : 'lv_LV'} />
      <meta property="og:image" content={image} /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" /><meta property="og:image:alt" content={imageAlt} />
      <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content={title} /><meta name="twitter:description" content={description} /><meta name="twitter:image" content={image} /><meta name="twitter:image:alt" content={imageAlt} /></>}
    <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="16x16 32x32 48x48" /><link rel="icon" type="image/svg+xml" href="/favicon.svg" /><link rel="apple-touch-icon" href="/apple-touch-icon.png" /><link rel="manifest" href="/site.webmanifest" />
    {stylesheets.map(href => <link key={href} rel="stylesheet" href={href} />)}
    {fonts.map(href => <link key={href} rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href={href} />)}
    {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />}
    {client && <script type="module" src={client} data-reading-tools="" />}
  </head>
}
