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
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-vendor';
            }
            if (id.includes('lucide-react') || id.includes('react-player')) {
              return 'ui-vendor';
            }
            if (id.includes('dexie')) {
              return 'db-vendor';
            }
            if (id.includes('socket.io-client')) {
              return 'network-vendor';
            }
          }
        }
      }
    }
  }
});
