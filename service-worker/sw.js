/* service-worker/custom-sw.js */
// LƯU Ý: file này sẽ được bundle, bạn có thể dùng ESM import
import { precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

console.log('Activate custom sw.js')
self.skipWaiting()
clientsClaim()

// Workbox sẽ inject danh sách asset build vào biến này
// đừng đổi tên biến!
precacheAndRoute(self.__WB_MANIFEST || [])


// (Tuỳ chọn) Push notifications nếu bạn dùng web-push
// self.addEventListener('push', (event) => {
//   const data = event.data ? event.data.json() : {}
//   const title = data.title || 'Thông báo'
//   const options = {
//     body: data.body || '',
//     icon: '/pwa-192x192.png',
//     data: data.data || {}
//   }
//   event.waitUntil(self.registration.showNotification(title, options))
// })

self.addEventListener('push', event => {
  event.waitUntil((async () => {
    let data = {};
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Notification', body: 'You have a new message!' };
    }
    await self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/favicon.ico'
    });
  })());
});
