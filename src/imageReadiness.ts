const groupFor = (image: HTMLImageElement) => image.closest<HTMLElement>('.xray-view,.atlas-picture,.time-visual,.atlas-comparison figure,.gateway-photo')

export function revealDeferredImages(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('picture[data-deferred-image]').forEach(picture => {
    picture.removeAttribute('data-deferred-image')
    const source = picture.querySelector<HTMLSourceElement>('source')!
    source.srcset = source.dataset.srcset || ''
    const image = picture.querySelector<HTMLImageElement>('img')!
    image.loading = 'eager' // Only after near-view or an explicit control interaction.
    image.src = image.dataset.originalSrc!
  })
}

/** Native load/decode signals; a quiet placeholder is never presented as a loading error. */
export function bindImageFallback(root: HTMLElement | Document) {
  const abort = new AbortController(), options = { signal: abort.signal, capture: true }
  const images = () => [...root.querySelectorAll<HTMLImageElement>('img[data-interactive-image]')]
  const sync = (image: HTMLImageElement) => {
    const group = groupFor(image)
    if (!group) return
    const visible = [...group.querySelectorAll<HTMLImageElement>('img[data-interactive-image]')].filter(img => !img.closest('[data-time-figure][aria-hidden=true]') && !img.closest('[data-deferred-image]'))
    const failed = visible.some(img => ['fallback', 'failed'].includes(img.dataset.imageState || ''))
    const ready = visible.length > 0 && visible.every(img => img.dataset.imageReady === 'true')
    group.toggleAttribute('data-images-ready', ready)
    group.toggleAttribute('data-image-error', failed)
    group.setAttribute('aria-busy', String(!ready && !failed))
    group.querySelector('[role=img]')?.setAttribute('aria-hidden', String(failed))
    const status = group.querySelector<HTMLElement>('[data-image-status]')
    if (status) status.hidden = !failed
  }
  const clearSources = (image: HTMLImageElement) => {
    image.closest('picture')?.querySelectorAll('source').forEach(source => source.removeAttribute('srcset'))
    image.removeAttribute('srcset')
  }
  const fail = (image: HTMLImageElement) => {
    if (image.dataset.imageState === 'failed') return
    delete image.dataset.imageReady
    image.dataset.originalAlt ??= image.alt
    clearSources(image)
    const attempt = image.dataset.imageAttempt || 'responsive'
    if (attempt === 'responsive' && image.currentSrc !== new URL(image.dataset.originalSrc!, location.href).href) {
      image.dataset.imageAttempt = 'original'; image.src = image.dataset.originalSrc!
    } else if (attempt !== 'alternate' && attempt !== 'fallback') {
      image.dataset.imageAttempt = 'alternate'; image.dataset.imageState = 'fallback'; image.alt = ''; image.src = image.dataset.alternateSrc!
    } else if (attempt === 'alternate') {
      image.dataset.imageAttempt = 'fallback'; image.dataset.imageState = 'fallback'; image.src = image.dataset.fallbackSrc!
    } else image.dataset.imageState = 'failed'
    sync(image)
    image.dispatchEvent(new Event('raster:state', { bubbles: true }))
  }
  const present = (image: HTMLImageElement) => {
    const src = image.currentSrc
    void image.decode().then(() => {
      if (abort.signal.aborted || image.currentSrc !== src) return
      image.dataset.imageReady = 'true'
      image.dataset.imageState = ['alternate', 'fallback'].includes(image.dataset.imageAttempt || '') ? 'fallback' : 'ready'
      if (image.dataset.imageState === 'ready' && image.dataset.originalAlt !== undefined) image.alt = image.dataset.originalAlt
      sync(image)
      image.dispatchEvent(new Event('raster:ready', { bubbles: true }))
    }).catch(() => { if (!abort.signal.aborted && image.currentSrc === src) fail(image) })
  }
  const imageEvent = (event: Event) => {
    const image = event.target
    if (!(image instanceof HTMLImageElement) || !image.hasAttribute('data-interactive-image')) return
    if (event.type === 'error') fail(image)
    else present(image)
  }
  root.addEventListener('error', imageEvent, options)
  root.addEventListener('load', imageEvent, options)
  root.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return
    const retry = event.target.closest('[data-image-retry]')
    if (!retry) return
    const group = retry.closest<HTMLElement>('.xray-view,.atlas-picture,.time-visual,.atlas-comparison figure')
    group?.querySelectorAll<HTMLImageElement>('img[data-interactive-image]').forEach(image => {
      if (!['fallback', 'failed'].includes(image.dataset.imageState || '')) return
      delete image.dataset.imageState; delete image.dataset.imageReady; delete image.dataset.imageAttempt
      if (image.dataset.originalAlt !== undefined) image.alt = image.dataset.originalAlt
      const source = image.closest('picture')?.querySelector<HTMLSourceElement>('source')
      if (source?.dataset.srcset) source.srcset = source.dataset.srcset
      image.src = image.dataset.originalSrc!
      sync(image)
      image.dispatchEvent(new Event('raster:state', { bubbles: true }))
    })
  }, { signal: abort.signal })
  images().forEach(image => {
    if (image.closest('[data-deferred-image]')) return
    sync(image)
    if (image.complete && image.currentSrc) {
      if (image.naturalWidth) present(image)
      else fail(image)
    }
  })
  return () => abort.abort()
}
