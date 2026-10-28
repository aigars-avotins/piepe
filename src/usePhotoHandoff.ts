import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { cinemaOrigin } from './cinemaGeometry'
import type { CinemaOrigin } from './cinemaGeometry'

type Pose = { x: number; y: number; scale: number }
type Aperture = { x: number; y: number; width: number; height: number }
const worldPose = (r: CinemaOrigin): Pose => ({ x: r.x, y: r.y, scale: r.width / 1920 })
const mix = (a: number, b: number, p: number) => a + (b - a) * p
/** Resolve object-fit/object-position once, including the selected observation's crop. */
function photoPose(image: HTMLImageElement): Pose {
  const r = image.getBoundingClientRect(), position = getComputedStyle(image).objectPosition.split(' ').map(parseFloat)
  const scale = Math.max(r.width / 1920, r.height / 1080)
  return { x: r.left + (r.width - 1920 * scale) * position[0] / 100, y: r.top + (r.height - 1080 * scale) * position[1] / 100, scale }
}
/** A fixed overflow clipper and inverse image transforms keep the source uniform in world space.
 * Only transforms/opacity animate: no changing layout or repainting a full-screen clip-path in WebKit.
 * Dense native keyframes approximate the inverse between samples to much less than one source pixel.
 */
function cameraFrames(canvas: Aperture, from: Aperture, to: Aperture, source: Pose, destination: Pose, shade: number, bridge: number, back: boolean) {
  const aperture: Keyframe[] = [], image: Keyframe[] = [], worldShade: Keyframe[] = []
  for (let i = 0; i <= 120; i++) {
    const p = i / 120, x = mix(from.x, to.x, p), y = mix(from.y, to.y, p)
    const sx = mix(from.width, to.width, p) / canvas.width, sy = mix(from.height, to.height, p) / canvas.height
    const scale = mix(source.scale, destination.scale, p), ix = mix(source.x, destination.x, p), iy = mix(source.y, destination.y, p)
    aperture.push({ offset: p, transform: `matrix(${sx},0,0,${sy},${x},${y})` })
    image.push({ offset: p, transform: `matrix(${scale / sx},0,0,${scale / sy},${(ix - x) / sx},${(iy - y) / sy})` })
    worldShade.push({ offset: p, transform: `matrix(${1 / sx},0,0,${1 / sy},${-x / sx},${-y / sy})`, opacity: mix(bridge, back ? 1 : 0, p) })
  }
  return { aperture, image, worldShade, shade: [{ opacity: shade }, { opacity: back ? 0 : 1 }] }
}

/** One source frame travels into the note, then returns from its actual current pose on close. */
export function usePhotoHandoff(dialog: RefObject<HTMLDialogElement | null>, open: boolean, origin: CinemaOrigin | undefined, onClose: () => void, onDocked: () => void) {
  const [moving, setMoving] = useState(false)
  const close = useRef(onClose), docked = useRef(onDocked), reverse = useRef<(() => void) | undefined>(undefined)
  useLayoutEffect(() => { close.current = onClose; docked.current = onDocked }, [onClose, onDocked])
  useLayoutEffect(() => {
    if (!open) return
    const node = dialog.current
    if (!node) return
    node.scrollTo({ top: 0, behavior: 'instant' })
    node.classList.toggle('photo-moving', !!origin)
    node.showModal()
    const photo = node.querySelector<HTMLElement>('.specimen-photo')!, image = photo.querySelector<HTMLImageElement>('img')!
    const shade = node.querySelector<HTMLElement>('.specimen-photo-shade')!, bridge = node.querySelector<HTMLElement>('.photo-world-shade')!
    const target = photo.getBoundingClientRect(), destination = photoPose(image)
    const styles = [photo, image, shade, bridge].map(element => [element, element.getAttribute('style')] as const)
    const restore = () => styles.forEach(([element, style]) => { if (style === null) element.removeAttribute('style'); else element.setAttribute('style', style) })
    let animations: Animation[] = [], cancelled = false, closing = false, installed = false, generation = 0, settleFrame = 0
    const focus = () => node.querySelector<HTMLButtonElement>('.close-discovery')?.focus({ preventScroll: true })
    const options = { duration: 1000, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'both' as const }
    const run = (back: boolean) => {
      if (!origin) { node.classList.remove('photo-moving'); setMoving(false); if (back) close.current(); else { docked.current(); focus() } return }
      const turn = ++generation, current = photo.getBoundingClientRect()
      const matrix = installed ? new DOMMatrixReadOnly(getComputedStyle(photo).transform).multiply(new DOMMatrixReadOnly(getComputedStyle(image).transform)) : undefined
      const currentImage = matrix ? { x: matrix.e, y: matrix.f, scale: (matrix.a + matrix.d) / 2 } : photoPose(image)
      const currentShade = installed ? Number(getComputedStyle(shade).opacity) : 1
      const currentBridge = installed ? Number(getComputedStyle(bridge).opacity) : 0
      animations.forEach(a => a.cancel())
      node.classList.add('photo-moving'); setMoving(true)
      Object.assign(photo.style, { position: 'fixed', inset: '0px', width: '100%', height: '100%', transformOrigin: '0 0', clipPath: 'none', willChange: 'transform' })
      Object.assign(image.style, { left: '0px', top: '0px', width: '1920px', height: '1080px', objectFit: 'fill', objectPosition: '50% 50%', transformOrigin: '0 0', willChange: 'transform' })
      Object.assign(shade.style, { inset: '-1px', width: 'calc(100% + 2px)', height: 'calc(100% + 2px)', willChange: 'opacity' })
      Object.assign(bridge.style, { left: '0px', top: '0px', width: '100%', height: '100%', transformOrigin: '0 0', backgroundImage: origin.shade, willChange: 'transform, opacity' })
      const world = back ? cinemaOrigin() || origin : origin, full = photo.getBoundingClientRect()
      const frames = cameraFrames(full, back ? current : full, back ? full : target, back ? currentImage : worldPose(origin), back ? worldPose(world) : destination, back ? currentShade : 0, back ? currentBridge : 1, back)
      animations = [photo.animate(frames.aperture, options), image.animate(frames.image, options), shade.animate(frames.shade, options), bridge.animate(frames.worldShade, options)]
      installed = true
      const playTogether = () => {
        const start = document.timeline.currentTime
        if (start === null) return
        // Inverse transforms require one clock; WebKit may resolve sequential play() calls apart.
        animations.forEach(animation => { animation.play(); animation.startTime = start })
      }
      if (!back) {
        // Prepare the decoded surface before starting its camera clock on high-density displays.
        animations.forEach(animation => { animation.pause(); animation.currentTime = 0 })
        void image.decode().catch(() => {}).then(() => {
          if (cancelled || turn !== generation || !installed) return
          requestAnimationFrame(() => requestAnimationFrame(() => {
            if (!cancelled && turn === generation && installed) playTogether()
          }))
        })
      } else playTogether()
      Promise.all(animations.map(a => a.finished)).then(() => {
        if (cancelled || turn !== generation) return
        if (back) { setMoving(false); node.classList.remove('photo-moving'); close.current(); return }
        animations.forEach(a => a.cancel()); restore(); installed = false
        // The camera already arrives at the normal object-fit crop. Removing photo-moving
        // must not start a second CSS object-position transition from the temporary 50% crop.
        const transition = image.style.transition
        image.style.transition = 'none'
        node.classList.remove('photo-moving'); setMoving(false); docked.current(); focus()
        void getComputedStyle(image).objectPosition
        settleFrame = requestAnimationFrame(() => { settleFrame = requestAnimationFrame(() => {
          if (cancelled || turn !== generation) return
          if (transition) image.style.transition = transition; else image.style.removeProperty('transition')
        }) })
      }).catch(() => {})
    }
    reverse.current = () => { if (closing) return; closing = true; run(true) }
    run(false)
    const resize = () => { animations.forEach(a => a.finish()) }
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const reduce = () => { if (preference.matches) resize() }
    window.addEventListener('resize', resize); preference.addEventListener('change', reduce)
    return () => { cancelled = true; cancelAnimationFrame(settleFrame); animations.forEach(a => a.cancel()); restore(); reverse.current = undefined; window.removeEventListener('resize', resize); preference.removeEventListener('change', reduce) }
  }, [dialog, open, origin])
  return { moving, requestClose: useCallback(() => reverse.current?.(), []), settle: () => dialog.current?.getAnimations({ subtree: true }).forEach(a => a.finish()) }
}
