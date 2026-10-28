export type CinemaOrigin = { x: number; y: number; width: number; height: number; shade: string }
export function cinemaOrigin(): CinemaOrigin | undefined {
  const plane = document.querySelector('.base-camera .media-plane')
  const shade = document.querySelector('.forest-shade')
  if (!plane || !shade) return
  const { x, y, width, height } = plane.getBoundingClientRect()
  return { x, y, width, height, shade: getComputedStyle(shade).backgroundImage }
}
