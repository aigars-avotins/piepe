type Preview = { left: number; top: number; width: number; height: number }

/** Expand the same photograph using a uniform image scale and a separate crop window. */
export function portalThreshold(image: HTMLImageElement, layer: HTMLElement, preview: Preview | undefined, reduced: boolean, closing = false) {
  const box = layer.getBoundingClientRect(), ratio = image.naturalWidth / image.naturalHeight
  const width = Math.max(box.width, box.height * ratio), height = width / ratio
  const left = (box.width - width) * .47, top = (box.height - height) * .5
  const visible = preview && preview.width > 0 && preview.height > 0 && preview.top < box.bottom && preview.top + preview.height > box.top
  const options = { duration: reduced ? 0 : visible ? 680 : closing ? 360 : 420, delay: closing && !reduced ? 450 : 0, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' as FillMode }
  image.style.opacity = '1'
  const animations: Animation[] = []
  if (visible && !reduced) {
    const cardHeight = Math.max(preview.height, preview.width / ratio), cardWidth = cardHeight * ratio
    const scale = cardHeight / height
    const x = preview.left - box.left + (preview.width - cardWidth) * .47 - left
    const y = preview.top - box.top + (preview.height - cardHeight) * .5 - top
    image.style.inset = 'auto'; image.style.left = `${left}px`; image.style.top = `${top}px`; image.style.width = `${width}px`; image.style.height = `${height}px`; image.style.transformOrigin = '0 0'
    const crop = `inset(${Math.max(0, preview.top - box.top)}px ${Math.max(0, box.right - preview.left - preview.width)}px ${Math.max(0, box.bottom - preview.top - preview.height)}px ${Math.max(0, preview.left - box.left)}px round 12px)`
    const plane = [{ transform: `translate(${x}px,${y}px) scale(${scale})` }, { transform: 'none' }]
    const cropFrames = [{ clipPath: crop }, { clipPath: 'inset(0px round 0px)' }]
    animations.push(image.animate(closing ? plane.slice().reverse() : plane, options), layer.animate(closing ? cropFrames.slice().reverse() : cropFrames, options))
  } else animations.push(layer.animate(closing ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 1 }], options))
  const cancel = () => animations.forEach(animation => animation.cancel())
  const reset = () => { for (const name of ['inset','left','top','width','height','transform-origin']) image.style.removeProperty(name) }
  const finished = Promise.all(animations.map(animation => animation.finished)).then(() => { if (!closing) { reset(); cancel() } })
  return { finished, cancel }
}
