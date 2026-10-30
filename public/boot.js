/* global document, matchMedia, Element */
// Paint the same opening frame before React attaches, without hiding no-JS content.
(() => {
  const root = document.documentElement
  root.classList.add('js')
  document.addEventListener('click', event => {
    if (event.target instanceof Element && event.target.closest('.skip-intro')) root.dataset.skipIntro = '1'
  }, { capture: true })
  const connection = navigator.connection
  let entered = false
  try { entered = sessionStorage.getItem('piepe-entered') === '1' } catch { /* Storage can be unavailable. */ }
  const staticVisit = entered || matchMedia('(prefers-reduced-motion: reduce)').matches || connection?.saveData || ['2g', 'slow-2g'].includes(connection?.effectiveType)
  if (staticVisit) root.classList.add('preference-static')
  // Prioritize the image this visit actually paints; static/return visits keep the final pose.
  const poster = document.createElement('link')
  poster.rel = 'preload'; poster.as = 'image'; poster.fetchPriority = 'high'
  poster.href = `/media/forest-${staticVisit ? 'final' : 'poster'}.jpg?v=2.3`
  document.head.appendChild(poster)
})()
