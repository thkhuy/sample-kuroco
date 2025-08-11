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
    strategies: 'injectManifest',
    srcDir: 'service-worker',
    filename: 'sw.js',
    registerType: 'autoUpdate',
    manifest: {
      name: 'Kuroco PWA Notify',
      short_name: 'KurocoPWA',
      lang: 'en',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#4A90E2'
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      // swSrc: 'my-sw.js',
      // swDest: 'sw.js',
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },
  plugins: ['~/plugins/push.client.ts']
})
