import type { Locale } from './i18n'
import { studySizes } from './imageSizes'
import { siteCopy } from './siteCopy'

// Responsive serving copies are separate. The owner JPEG remains the native fallback/original;
// the 960px serving copy is the last real attempt before the labelled wallpaper substitute.
export default function RasterImage({ name, alt = '', className = '', width = 2752, height = 1536, sizes = studySizes, deferred = false }: {
  name: string; alt?: string; className?: string; width?: number; height?: number; sizes?: string; deferred?: boolean
}) {
  const original = `/images/interactive/${name}.jpg`
  const candidates = (format: 'avif' | 'webp') => [480, 960, 1600, width].map(size => `/images/interactive/responsive/${name}-${size}.${format} ${size}w`).join(', ')
  return <>
    <picture className="raster-picture" data-deferred-image={deferred || undefined}>
      {(['avif', 'webp'] as const).map(format => <source key={format} type={`image/${format}`} srcSet={deferred ? undefined : candidates(format)} data-srcset={candidates(format)} sizes={sizes} />)}
      <img draggable={false} className={className} src={deferred ? undefined : original} data-original-src={original} data-interactive-image="" data-alternate-src={`/images/interactive/responsive/${name}-960.webp`} data-fallback-src="/wallpapers/previews/desktop.webp" alt={alt} width={width} height={height} loading="lazy" decoding="async" />
    </picture>
    {deferred && <noscript><img src={original} alt={alt} width={width} height={height} loading="lazy" decoding="async" /></noscript>}
  </>
}

export function RasterStatus({ locale }: { locale: Locale }) {
  return <div className="raster-status" data-image-status hidden>
    <p role="status" aria-live="polite">{siteCopy[locale].status.imageUnavailable}</p>
    <button type="button" data-image-retry>{siteCopy[locale].status.retry}</button>
  </div>
}
