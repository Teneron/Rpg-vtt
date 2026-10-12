import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true // Libera o acesso para IPs externos (Radmin, LAN, etc)
  },
  build: {
    sourcemap: false, // Reduz tamanho do build (remove arquivos .map pesados)
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const norm = id.replace(/\\/g, '/');
          if (norm.includes('preload-helper') || norm.includes('vite/')) {
            return 'react-vendor';
          }
          if (norm.includes('/node_modules/')) {
            if (
              norm.includes('/node_modules/react/') ||
              norm.includes('/node_modules/react-dom/') ||
              norm.includes('/node_modules/scheduler/') ||
              norm.includes('/node_modules/react-is/')
            ) {
              return 'react-vendor';
            }
            if (
              norm.includes('/node_modules/three/') ||
              norm.includes('/node_modules/@react-three/') ||
              norm.includes('/node_modules/cannon-es/')
            ) {
              return 'three-vendor';
            }
            if (
              norm.includes('/node_modules/lucide-react/') ||
              norm.includes('/node_modules/react-player/')
            ) {
              return 'ui-vendor';
            }
            if (norm.includes('/node_modules/dexie/') || norm.includes('/node_modules/dexie-react-hooks/')) {
              return 'db-vendor';
            }
            if (norm.includes('/node_modules/socket.io-client/')) {
              return 'network-vendor';
            }
          }
        }
      }
    }
  }
});
