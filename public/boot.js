/* global document, matchMedia */
// Paint the same opening frame before React attaches, without hiding no-JS content.
(() => {
  const root = document.documentElement
  root.classList.add('js')
  const connection = navigator.connection
  let entered = false
  try { entered = sessionStorage.getItem('piepe-entered') === '1' } catch { /* Storage can be unavailable. */ }
  if (entered || matchMedia('(prefers-reduced-motion: reduce)').matches || connection?.saveData || ['2g', 'slow-2g'].includes(connection?.effectiveType)) root.classList.add('preference-static')
})()
