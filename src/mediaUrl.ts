// Matched movies and source-frame stills must move to the new edition together in browser caches.
export const mediaUrl = (path: string) => path.startsWith('/media/') ? `${path.split('?')[0]}?v=2.3` : path
