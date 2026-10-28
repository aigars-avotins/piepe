import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource/cormorant-garamond/latin-400.css'
import '@fontsource/cormorant-garamond/latin-400-italic.css'
import '@fontsource/manrope/latin-400.css'
import '@fontsource/manrope/latin-500.css'
import '@fontsource/cormorant-garamond/latin-ext-400.css'
import '@fontsource/cormorant-garamond/latin-ext-400-italic.css'
import '@fontsource/manrope/latin-ext-400.css'
import '@fontsource/manrope/latin-ext-500.css'
import App from './App'
import './style.css'

const root = document.getElementById('root')!
const app = <App initialLocale={document.documentElement.lang === 'en' ? 'en' : 'lv'} />
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
