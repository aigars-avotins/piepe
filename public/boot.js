/* global document, matchMedia, Element, location */
// Paint the same opening frame before React attaches, without hiding no-JS content.
(() => {
  const root = document.documentElement
  root.classList.add('js')
  // A saved legacy mode must not return through a later Back/Forward visit.
  try { localStorage.removeItem('piepe-atmosphere') } catch { /* Storage is optional. */ }
  document.addEventListener('click', event => {
    if (event.target instanceof Element && event.target.closest('.skip-intro')) root.dataset.skipIntro = '1'
  }, { capture: true })
  const connection = navigator.connection
  let entered = false
  try { entered = sessionStorage.getItem('piepe-entered') === '1' } catch { /* Storage can be unavailable. */ }
  const settled = entered || matchMedia('(prefers-reduced-motion: reduce)').matches || connection?.saveData || ['2g', 'slow-2g'].includes(connection?.effectiveType)
  if (settled) root.classList.add('preference-static')
  // Preload only the frame this visit paints first: the film's opening frame, or the settled forest.
  const opensSettled = settled || (location.hash && location.hash !== '#forest')
  if (opensSettled) root.classList.add('opens-settled')
  const still = document.createElement('link')
  still.rel = 'preload'; still.as = 'image'; still.fetchPriority = 'high'
  still.href = `/media/forest-${opensSettled ? 'final' : 'poster'}.jpg?v=${root.dataset.media}`
  document.head.append(still)
})()
