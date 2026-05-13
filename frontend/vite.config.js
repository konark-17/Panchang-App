import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'पंचांग Calendar',
        short_name: 'Panchang',
        description: 'Hindu Panchang Calendar with Tithi and Reminders',
        theme_color: '#1a0d00',
        background_color: '#1a0d00',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/api\/panchang\/month/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'panchang-month-cache',
              expiration: { maxEntries: 12, maxAgeSeconds: 60 * 60 * 24 * 7 }
            }
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
