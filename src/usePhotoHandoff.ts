import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { cinemaOrigin } from './cinemaGeometry'
import type { CinemaOrigin } from './cinemaGeometry'

type Pose = { x: number; y: number; scale: number }
type Aperture = { x: number; y: number; width: number; height: number }
const worldPose = (r: CinemaOrigin): Pose => ({ x: r.x, y: r.y, scale: r.width / 1920 })
const mix = (a: number, b: number, p: number) => a + (b - a) * p
/** Resolve the actual observation crop, including an interrupted CSS observation camera. */
function photoPose(image: HTMLImageElement): Pose {
  const r = image.getBoundingClientRect(), position = getComputedStyle(image).objectPosition.split(' ').map(parseFloat)
  const scale = Math.max(r.width / 1920, r.height / 1080)
  return { x: r.left + (r.width - 1920 * scale) * position[0] / 100, y: r.top + (r.height - 1080 * scale) * position[1] / 100, scale }
}

/** One GSAP clock commits the aperture and its exact inverse on the same paint.
 * Independent native compositor clocks can resolve nested transforms at different
 * instants in WebKit, and their finished promises can remain pending after reversal.
 * Only transforms/opacity change; there is no animated layout or full-screen clip-path.
 */
export function usePhotoHandoff(dialog: RefObject<HTMLDialogElement | null>, open: boolean, origin: CinemaOrigin | undefined, onClose: () => void, onDocked: () => void) {
  const [moving, setMoving] = useState(false)
  const close = useRef(onClose), docked = useRef(onDocked), reverse = useRef<(() => void) | undefined>(undefined), finish = useRef<(() => void) | undefined>(undefined)
  useLayoutEffect(() => { close.current = onClose; docked.current = onDocked }, [onClose, onDocked])
  useLayoutEffect(() => {
    if (!open) return
    const node = dialog.current
    if (!node) return
    node.scrollTo({ top: 0, behavior: 'instant' }); node.classList.toggle('photo-moving', !!origin); node.showModal()
    const photo = node.querySelector<HTMLElement>('.specimen-photo')!, image = photo.querySelector<HTMLImageElement>('img')!
    const shade = node.querySelector<HTMLElement>('.specimen-photo-shade')!, bridge = node.querySelector<HTMLElement>('.photo-world-shade')!
    const target = photo.getBoundingClientRect(), destination = photoPose(image)
    const styles = [photo, image, shade, bridge].map(element => [element, element.getAttribute('style')] as const)
    const restore = () => styles.forEach(([element, style]) => { if (style === null) element.removeAttribute('style'); else element.setAttribute('style', style) })
    let tween: gsap.core.Tween | undefined, cancelled = false, closing = false, installed = false, generation = 0, settleFrame = 0, prepareFrame = 0
    const focus = () => node.querySelector<HTMLButtonElement>('.close-discovery')?.focus({ preventScroll: true })
    const clearCamera = () => { delete photo.dataset.cameraPhase; delete photo.dataset.cameraProgress }
    const run = (back: boolean) => {
      if (!origin) { node.classList.remove('photo-moving'); setMoving(false); if (back) close.current(); else { docked.current(); focus() } return }
      if (back && installed && photo.dataset.cameraPhase === 'preparing') {
        generation++; tween?.kill(); restore(); installed = false; finish.current = undefined; clearCamera()
        node.classList.remove('photo-moving'); setMoving(false); close.current(); return
      }
      const turn = ++generation, current = photo.getBoundingClientRect()
      const matrix = installed ? new DOMMatrixReadOnly(getComputedStyle(photo).transform).multiply(new DOMMatrixReadOnly(getComputedStyle(image).transform)) : undefined
      const currentImage = matrix ? { x: matrix.e, y: matrix.f, scale: (matrix.a + matrix.d) / 2 } : photoPose(image)
      const currentShade = installed ? Number(getComputedStyle(shade).opacity) : 1, currentBridge = installed ? Number(getComputedStyle(bridge).opacity) : 0
      tween?.kill(); tween = undefined; cancelAnimationFrame(prepareFrame)
      node.classList.add('photo-moving'); setMoving(true)
      Object.assign(photo.style, { position: 'fixed', inset: '0px', width: '100%', height: '100%', transform: 'none', transformOrigin: '0 0', clipPath: 'none', willChange: 'transform' })
      Object.assign(image.style, { left: '0px', top: '0px', width: '1920px', height: '1080px', objectFit: 'fill', objectPosition: '50% 50%', transform: 'none', transformOrigin: '0 0', willChange: 'transform' })
      Object.assign(shade.style, { inset: '-1px', width: 'calc(100% + 2px)', height: 'calc(100% + 2px)', willChange: 'opacity' })
      Object.assign(bridge.style, { left: '0px', top: '0px', width: '100%', height: '100%', transformOrigin: '0 0', backgroundImage: origin.shade, willChange: 'transform, opacity' })
      const world = back ? cinemaOrigin() || origin : origin, full = photo.getBoundingClientRect()
      const from: Aperture = back ? current : full, to: Aperture = back ? full : target
      const source = back ? currentImage : worldPose(origin), destinationImage = back ? worldPose(world) : destination
      const clock = { progress: 0 }
      const paint = () => {
        const p = clock.progress, x = mix(from.x, to.x, p), y = mix(from.y, to.y, p)
        const sx = mix(from.width, to.width, p) / full.width, sy = mix(from.height, to.height, p) / full.height
        const scale = mix(source.scale, destinationImage.scale, p), ix = mix(source.x, destinationImage.x, p), iy = mix(source.y, destinationImage.y, p)
        photo.style.transform = `matrix(${sx},0,0,${sy},${x},${y})`
        image.style.transform = `matrix(${scale / sx},0,0,${scale / sy},${(ix - x) / sx},${(iy - y) / sy})`
        bridge.style.transform = `matrix(${1 / sx},0,0,${1 / sy},${-x / sx},${-y / sy})`
        bridge.style.opacity = String(mix(back ? currentBridge : 1, back ? 1 : 0, p))
        shade.style.opacity = String(mix(back ? currentShade : 0, back ? 0 : 1, p))
        photo.dataset.cameraProgress = String(p)
      }
      installed = true; photo.dataset.cameraPhase = 'preparing'; paint()
      const complete = () => {
        if (cancelled || turn !== generation || !installed) return
        generation++; tween?.kill(); tween = undefined; finish.current = undefined; clearCamera()
        if (back) { setMoving(false); node.classList.remove('photo-moving'); close.current(); return }
        restore(); installed = false
        // Commit the arrived crop without restarting the ordinary object-position transition.
        const transition = image.style.transition, settled = generation
        image.style.transition = 'none'; node.classList.remove('photo-moving'); setMoving(false); docked.current(); focus()
        void getComputedStyle(image).objectPosition
        settleFrame = requestAnimationFrame(() => { settleFrame = requestAnimationFrame(() => {
          if (cancelled || settled !== generation) return
          if (transition) image.style.transition = transition; else image.style.removeProperty('transition')
        }) })
      }
      finish.current = () => { clock.progress = 1; paint(); complete() }
      void (back ? Promise.resolve() : image.decode().catch(() => {})).then(() => {
        if (cancelled || turn !== generation || !installed) return
        prepareFrame = requestAnimationFrame(() => { prepareFrame = requestAnimationFrame(() => {
          if (cancelled || turn !== generation || !installed) return
          photo.dataset.cameraPhase = back ? 'returning' : 'moving'
          tween = gsap.to(clock, { progress: 1, duration: 1, ease: 'power2.out', onUpdate: paint, onComplete: complete })
        }) })
      })
    }
    reverse.current = () => { if (closing) return; closing = true; run(true) }; run(false)
    const resize = () => finish.current?.(), preference = matchMedia('(prefers-reduced-motion: reduce)')
    const reduce = () => { if (preference.matches) resize() }
    window.addEventListener('resize', resize); preference.addEventListener('change', reduce)
    return () => { cancelled = true; cancelAnimationFrame(settleFrame); cancelAnimationFrame(prepareFrame); tween?.kill(); restore(); clearCamera(); reverse.current = undefined; finish.current = undefined; window.removeEventListener('resize', resize); preference.removeEventListener('change', reduce) }
  }, [dialog, open, origin])
  return { moving, requestClose: useCallback(() => reverse.current?.(), []), settle: useCallback(() => finish.current?.(), []) }
}
