import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './ErrorBoundary.tsx'

// Auto-reload on Vite dynamic import failure (stale chunk after new build)
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    console.warn('[Vite] Stale chunk detected after deployment. Auto-reloading page...');
    event.preventDefault();
    const lastReload = parseInt(sessionStorage.getItem('last_chunk_reload') || '0', 10);
    if (Date.now() - lastReload > 5000) {
      sessionStorage.setItem('last_chunk_reload', Date.now().toString());
      window.location.reload();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
)
