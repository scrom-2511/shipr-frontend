import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  server: {
    allowedHosts: ["healthcare-camcorders-oecd-flour.trycloudflare.com"],
    proxy: {
      '/api': {
        target: 'https://francisco-unscholarlike-punctually.ngrok-free.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
        headers: {
          'ngrok-skip-browser-warning': 'true',
        }
      }
    }
  },
})
