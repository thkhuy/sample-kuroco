export default defineNuxtPlugin(async () => {
  console.log('[Push] Starting registration...')

  // if (!process.client) return
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('[Push] Browser does not support push notifications.')
    return
  }

  try {
    const registration = await navigator.serviceWorker.ready
    // const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('BK4gbl_eAnY702WNd1vMOah_xxtY7qh1DChs4a4sZ86Q7-eNfuUU_DwRwF-6tDJJZnV7N2tjAxrran0mfAEO50I')
    })

    hostPort = 'https://e82dd8baabab8625460264fc9dcf72ab.serveo.net'
    url = hostPort + '/save-sub'
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    })

    console.log('[Push] Subscribed successfully:', subscription.endpoint)
  } catch (error) {
    console.error('[Push] Subscription error:', error)
  }

  // helper: convert VAPID key
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/')

    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
})
