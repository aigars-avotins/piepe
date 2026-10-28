import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { cinemaOrigin } from './cinemaGeometry'
import type { CinemaOrigin } from './cinemaGeometry'

const clip = (r: DOMRect) => `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px)`
const worldTransform = (r: CinemaOrigin) => `translate(${r.x}px,${r.y}px) scale(${r.width / 1920})`
const shadeTransform = (r: DOMRect) => `translate(${r.left}px,${r.top}px) scale(${r.width / innerWidth},${r.height / innerHeight})`
/** Resolve object-fit/object-position once; animate a uniform source image, never its layout. */
function photoTransform(image: HTMLImageElement) {
  const r = image.getBoundingClientRect(), position = getComputedStyle(image).objectPosition.split(' ').map(parseFloat)
  const scale = Math.max(r.width / 1920, r.height / 1080)
  return `translate(${r.left + (r.width - 1920 * scale) * position[0] / 100}px,${r.top + (r.height - 1080 * scale) * position[1] / 100}px) scale(${scale})`
}

/** One source frame travels into the note through a clipping aperture, then returns on close. */
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
    const target = photo.getBoundingClientRect(), destination = photoTransform(image)
    const styles = [photo, image, shade, bridge].map(element => [element, element.getAttribute('style')] as const)
    const restore = () => styles.forEach(([element, style]) => { if (style === null) element.removeAttribute('style'); else element.setAttribute('style', style) })
    let animations: Animation[] = [], cancelled = false, closing = false, installed = false, generation = 0
    const focus = () => node.querySelector<HTMLButtonElement>('.close-discovery')?.focus({ preventScroll: true })
    // A rare cinematic camera move, rather than an ordinary modal entrance. Skip remains instant.
    const options = { duration: 1000, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'both' as const }
    const run = (back: boolean) => {
      if (!origin) { node.classList.remove('photo-moving'); setMoving(false); if (back) close.current(); else { docked.current(); focus() } return }
      const turn = ++generation
      const currentClip = installed ? getComputedStyle(photo).clipPath : clip(photo.getBoundingClientRect())
      const currentImage = installed ? getComputedStyle(image).transform : photoTransform(image)
      const currentShade = installed ? getComputedStyle(shade).opacity : '1'
      const currentShadeTransform = installed ? getComputedStyle(shade).transform : shadeTransform(shade.getBoundingClientRect())
      const currentBridge = installed ? getComputedStyle(bridge).opacity : '0'
      animations.forEach(a => a.cancel())
      node.classList.add('photo-moving'); setMoving(true)
      // Constant layout dimensions. Only the aperture, image transform and grading opacity animate.
      Object.assign(photo.style, { position: 'fixed', inset: '0px', width: '100%', height: '100%', transform: 'translateZ(0)', willChange: 'clip-path' })
      Object.assign(image.style, { left: '0px', top: '0px', width: '1920px', height: '1080px', objectFit: 'fill', objectPosition: '50% 50%', transformOrigin: '0 0', willChange: 'transform' })
      Object.assign(shade.style, { left: '0px', top: '0px', width: '100%', height: '100%', transformOrigin: '0 0', willChange: 'transform, opacity' })
      bridge.style.willChange = 'opacity'
      bridge.style.backgroundImage = origin.shade
      const world = back ? cinemaOrigin() || origin : origin
      animations = [
        photo.animate([{ clipPath: back ? currentClip : 'inset(0px 0px 0px 0px)' }, { clipPath: back ? 'inset(0px 0px 0px 0px)' : clip(target) }], options),
        image.animate([{ transform: back ? currentImage : worldTransform(origin) }, { transform: back ? worldTransform(world) : destination }], options),
        shade.animate([{ opacity: back ? currentShade : '0', transform: back ? currentShadeTransform : 'none' }, { opacity: back ? '0' : '1', transform: back ? 'none' : shadeTransform(target) }], options),
        bridge.animate([{ opacity: back ? currentBridge : '1' }, { opacity: back ? '1' : '0' }], options),
      ]
      installed = true
      if (!back) {
        // Give the decoded, full-frame source a painted surface before starting the camera clock.
        // High-density WebKit can otherwise spend the opening of the move rasterizing the dialog.
        animations.forEach(animation => { animation.pause(); animation.currentTime = 0 })
        void image.decode().catch(() => {}).then(() => {
          requestAnimationFrame(() => requestAnimationFrame(() => {
            if (!cancelled && turn === generation && installed) animations.forEach(animation => animation.play())
          }))
        })
      }
      Promise.all(animations.map(a => a.finished)).then(() => {
        if (cancelled || turn !== generation) return
        if (back) { setMoving(false); node.classList.remove('photo-moving'); close.current(); return }
        animations.forEach(a => a.cancel()); restore(); installed = false
        node.classList.remove('photo-moving'); setMoving(false); docked.current(); focus()
      }).catch(() => {})
    }
    reverse.current = () => { if (closing) return; closing = true; run(true) }
    run(false)
    const resize = () => { animations.forEach(a => a.finish()) }
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const reduce = () => { if (preference.matches) resize() }
    window.addEventListener('resize', resize); preference.addEventListener('change', reduce)
    return () => { cancelled = true; animations.forEach(a => a.cancel()); restore(); reverse.current = undefined; window.removeEventListener('resize', resize); preference.removeEventListener('change', reduce) }
  }, [dialog, open, origin])
  return { moving, requestClose: useCallback(() => reverse.current?.(), []), settle: () => dialog.current?.getAnimations({ subtree: true }).forEach(a => a.finish()) }
}
