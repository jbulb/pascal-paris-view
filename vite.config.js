import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // "v2" generation: renamed after a bad cache-control/content-type
        // window on 2026-07-18 poisoned some browser caches for the old
        // asset URLs. New names force every client to fetch fresh copies.
        entryFileNames: 'assets/v2-[name]-[hash].js',
        chunkFileNames: 'assets/v2-[name]-[hash].js',
        assetFileNames: 'assets/v2-[name]-[hash][extname]',
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
      '/uploads': 'http://localhost:8000',
    },
  },
})
