// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,   // 👈 uses Railway's PORT
    host: '0.0.0.0',                  // 👈 important so Railway can access it
    proxy: {
      '/api': {
        target: 'https://myapp2-736053828578.asia-south2.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure:true
      },
    },
  },
})
