const CACHE = 'gastos-v2'
const BASE = '/app-control-gastos'

const STATIC = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/manifest.json`,
  `${BASE}/favicon.svg`,
  `${BASE}/pwa-192.png`,
  `${BASE}/pwa-512.png`,
]

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(STATIC)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  const url = new URL(e.request.url)
  if (!url.pathname.startsWith(BASE)) return

  e.respondWith(
    caches.match(e.request).then((cached) => {
      const network = fetch(e.request).then((res) => {
        if (res.ok) {
          const clone = res.clone()
          caches.open(CACHE).then((c) => c.put(e.request, clone))
        }
        return res
      })
      return cached || network
    })
  )
})
