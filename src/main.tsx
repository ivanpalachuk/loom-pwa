import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

// Registrar Service Worker automáticamente con vite-plugin-pwa
const updateSW = registerSW({
  onNeedRefresh() {
    // Mostrar notificación cuando hay una nueva versión
    if (confirm('Nueva versión disponible. ¿Recargar?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App lista para trabajar offline')
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
