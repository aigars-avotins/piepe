// Match real origins, including the site's HTTP entry point, never a hostname substring.
const siteOrigins = new Set(['https://pie.pe', 'http://pie.pe'])

export function plainLinkActivation(event: { button: number; defaultPrevented: boolean; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean }) {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

export function linkPolicy(href: string) {
  try {
    const url = new URL(href, 'https://pie.pe/')
    if ((url.protocol === 'https:' || url.protocol === 'http:') && !siteOrigins.has(url.origin)) {
      return { target: '_blank' as const, rel: 'noopener noreferrer' }
    }
  } catch { /* Leave native handling of an invalid URL intact. */ }
  return { target: undefined, rel: undefined }
}
