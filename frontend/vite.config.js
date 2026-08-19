import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite para producción
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000
  }
})
