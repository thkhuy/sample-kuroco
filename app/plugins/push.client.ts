// plugins/push.client.ts
export default defineNuxtPlugin(() => {
  const VAPID_PUBLIC_KEY =
    'BK4gbl_eAnY702WNd1vMOah_xxtY7qh1DChs4a4sZ86Q7-eNfuUU_DwRwF-6tDJJZnV7N2tjAxrran0mfAEO50I'

  async function subscribePush(serverUrl: string) {
    if (!serverUrl) throw new Error('Server URL is required')
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Browser does not support Service Worker / Push')
    }

    // đảm bảo SW đã sẵn sàng
    const registration = await navigator.serviceWorker.ready

    // subscribe (có thể trả về sub hiện có nếu đã đăng ký)
    const existing = await registration.pushManager.getSubscription()
    const subscription =
      existing ||
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      }))

    // gửi lên server
    const res = await fetch(normalize(serverUrl) + '/save-sub', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    })
    if (!res.ok) {
      const t = await res.text().catch(() => '')
      throw new Error(`Save-sub failed: ${res.status} ${t}`)
    }
    return subscription
  }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
    return outputArray
  }

  function normalize(url: string) {
    // bỏ dấu “/” cuối nếu có, và đảm bảo có protocol
    const u = url.trim().replace(/\/+$/, '')
    if (/^https?:\/\//i.test(u)) return u
    return 'http://' + u
  }

  return {
    provide: {
      subscribePush
    }
  }
})
