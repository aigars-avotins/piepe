/** Progressive behaviour for the native <details> site menu: Escape, outside press and link choice close it. */
export function bindSiteMenu(root: Document | HTMLElement = document) {
  const abort = new AbortController(), options = { signal: abort.signal }
  const menus = () => [...root.querySelectorAll<HTMLDetailsElement>('details[data-site-menu]')]
  const close = (menu: HTMLDetailsElement, focus = false) => { if (!menu.open) return; menu.open = false; if (focus) menu.querySelector<HTMLElement>('summary')?.focus({ preventScroll: true }) }
  root.addEventListener('keydown', event => {
    if ((event as KeyboardEvent).key !== 'Escape') return
    const menu = menus().find(item => item.open)
    // An open menu owns Escape, including inside a modal dialog: close it, not the dialog.
    if (menu) { event.preventDefault(); event.stopPropagation(); close(menu, true) }
  }, { ...options, capture: true })
  root.addEventListener('pointerdown', event => { for (const menu of menus()) if (!menu.contains(event.target as Node)) close(menu) }, options)
  root.addEventListener('focusin', event => { for (const menu of menus()) if (!menu.contains(event.target as Node)) close(menu) }, options)
  root.addEventListener('click', event => { const link = (event.target as Element).closest?.('details[data-site-menu] a'); if (link) close(link.closest<HTMLDetailsElement>('details')!) }, options)
  return () => abort.abort()
}

/** The site's one small light follows the pointer on reading pages. Fine pointers only; never under reduced motion. */
export function bindAttentionLight() {
  const light = document.querySelector<HTMLElement>('[data-attention-light]')
  if (!light || !matchMedia('(hover:hover) and (pointer:fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  let frame = 0, x = 0, y = 0
  const paint = () => { frame = 0; light.style.transform = `translate3d(${x}px,${y}px,0)`; light.dataset.active = 'true' }
  window.addEventListener('pointermove', event => { x = event.clientX; y = event.clientY; frame ||= requestAnimationFrame(paint) }, { passive: true })
  document.documentElement.addEventListener('pointerleave', () => { delete light.dataset.active })
}
