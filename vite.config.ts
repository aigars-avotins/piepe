import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { mediaVersion } from './src/release'

// Stylesheets and the HTML template cannot import release.ts; they carry this token instead.
const token = '__MEDIA_VERSION__'
const mediaEdition = (): Plugin => ({
  name: 'piepe-media-edition', enforce: 'pre',
  transform(code, id) { return id.split('?')[0].endsWith('.css') && code.includes(token) ? { code: code.replaceAll(token, mediaVersion), map: null } : null },
  transformIndexHtml: html => html.replaceAll(token, mediaVersion),
})
export default defineConfig({ plugins: [mediaEdition(), react()], build: { target: 'es2022', rollupOptions: { output: {
  // Stable vendor files: a copy or style change no longer invalidates React or GSAP in visitors' caches.
  manualChunks: id => /node_modules\/(react|react-dom|scheduler)\//.test(id) ? 'react' : /node_modules\/gsap\//.test(id) ? 'gsap' : undefined,
} } } })
