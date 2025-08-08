
self.addEventListener('push', event => {
  let data = {}
  try {
    data = event.data.json()
  } catch (e) {
    data = { title: 'Notification', body: 'You have a new message!' }
  }
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/favicon.ico'
  })
});
