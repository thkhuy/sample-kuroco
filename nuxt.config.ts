// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 9090
  },
  modules: ['@vite-pwa/nuxt'],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Kuroco PWA Notify',
      short_name: 'KurocoPWA',
      lang: 'en',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#4A90E2'
    },
    devOptions: {
      enabled: true,
      type: 'module'
    },
    workbox: {
      globPatterns: [
        '**/*.{js,css,html,ico,png,svg,json}',
      ],
      navigateFallback: '/', // quan trọng cho SPA
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/tma-kuroco-sample\.g\.kuroco-front\.app\/.*$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'kuroco-cache'
          }
        }
      ]
    }
  },
  plugins: ['~/plugins/push.client.ts']
})
