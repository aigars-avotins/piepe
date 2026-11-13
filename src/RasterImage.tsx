import type { Locale } from './i18n'
import { studySizes } from './imageSizes'

// Responsive serving copies are separate. The owner JPEG remains the native fallback/original.
export default function RasterImage({ name, alt = '', className = '', width = 2752, height = 1536, sizes = studySizes, deferred = false }: {
  name: string; alt?: string; className?: string; width?: number; height?: number; sizes?: string; deferred?: boolean
}) {
  const original = `/images/interactive/${name}.jpg`
  const srcSet = [480, 960, 1600, width].map(size => `/images/interactive/responsive/${name}-${size}.webp ${size}w`).join(', ')
  return <>
    <picture className="raster-picture" data-deferred-image={deferred || undefined}>
      <source type="image/webp" srcSet={deferred ? undefined : srcSet} data-srcset={srcSet} sizes={sizes} />
      <img draggable={false} className={className} src={deferred ? undefined : original} data-original-src={original} data-interactive-image="" data-alternate-src={`/images/interactive/${name}.webp`} data-fallback-src="/wallpapers/previews/desktop.webp" alt={alt} width={width} height={height} loading="lazy" decoding="async" />
    </picture>
    {deferred && <noscript><img src={original} alt={alt} width={width} height={height} loading="lazy" decoding="async" /></noscript>}
  </>
}

export function RasterStatus({ locale }: { locale: Locale }) {
  return <div className="raster-status" data-image-status hidden>
    <p role="status" aria-live="polite">{locale === 'lv' ? 'Izpētes attēls nav pieejams. Oriģināla saite paliek pieejama.' : 'The study image is unavailable. Its original link remains available.'}</p>
    <button type="button" data-image-retry>{locale === 'lv' ? 'Mēģināt vēlreiz' : 'Try again'}</button>
  </div>
}
