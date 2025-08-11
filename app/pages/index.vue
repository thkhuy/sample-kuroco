<template>
  <main class="container">
    <h1>Web Push Demo</h1>

    <label>
      Push Server (host:port hoặc URL đầy đủ)
      <input
        v-model="serverUrl"
        placeholder="http://localhost:4444"
        spellcheck="false"
      />
    </label>

    <div class="row">
      <button @click="onSubscribe" :disabled="loading">
        {{ loading ? 'Subscribing…' : 'Subscribe' }}
      </button>
      <button @click="onSendTest" :disabled="loading || !subscribed">
        Send Test
      </button>
      <button @click="onUnregisterSW" :disabled="loading">
        Unregister SW
      </button>
    </div>

    <p class="status" :class="{ error: !!error }">
      {{ error ? '❌ ' + error : status }}
    </p>

    <NuxtRouteAnnouncer />
  </main>
</template>

<script setup lang="ts">
const { $subscribePush } = useNuxtApp()

const serverUrl = ref<string>(
  (process.client && localStorage.getItem('pushServerUrl')) || 'http://localhost:4444'
)
const status = ref('Ready.')
const error = ref<string | null>(null)
const loading = ref(false)
const subscribed = ref(false)

watch(serverUrl, (v) => {
  if (process.client) localStorage.setItem('pushServerUrl', v)
})

async function onSubscribe() {
  error.value = null
  loading.value = true
  try {
    const sub = await $subscribePush(serverUrl.value)
    subscribed.value = true
    status.value = '✅ Subscribed: ' + sub.endpoint
  } catch (e: any) {
    error.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
}

async function onSendTest() {
  error.value = null
  loading.value = true
  try {
    const res = await fetch(normalize(serverUrl.value) + '/send-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Hello', body: 'From server' })
    })
    if (!res.ok) throw new Error(`send-push failed: ${res.status}`)
    status.value = '📨 Test push sent!'
  } catch (e: any) {
    error.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
}

async function onUnregisterSW() {
  if (!('serviceWorker' in navigator)) return
  const regs = await navigator.serviceWorker.getRegistrations()
  await Promise.all(regs.map((r) => r.unregister()))
  subscribed.value = false
  status.value = 'SW unregistered.'
}

function normalize(url: string) {
  const u = url.trim().replace(/\/+$/, '')
  if (/^https?:\/\//i.test(u)) return u
  return 'http://' + u
}
</script>

<style scoped>
.container { max-width: 720px; margin: 2rem auto; padding: 1rem; }
label { display: block; margin-bottom: .75rem; }
input {
  width: 100%; padding: .6rem .8rem; border-radius: .5rem;
  border: 1px solid #ccc; margin-top: .25rem;
}
.row { display: flex; gap: .5rem; margin: .75rem 0 0; }
button {
  padding: .55rem .9rem; border-radius: .5rem; border: 1px solid #ddd; cursor: pointer;
}
.status { margin-top: .75rem; }
.error { color: #b00020; }
</style>
