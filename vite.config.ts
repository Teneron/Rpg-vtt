import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true // Libera o acesso para IPs externos (Radmin, LAN, etc)
  },
  build: {
    sourcemap: false // Reduz tamanho do build (remove arquivos .map pesados)
  }
})
