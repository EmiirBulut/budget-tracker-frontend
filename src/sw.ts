/// <reference lib="WebWorker" />
/// <reference types="vite-plugin-pwa/vanillajs" />

import { clientsClaim } from 'workbox-core'
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

declare const self: ServiceWorkerGlobalScope

// Send SKIP_WAITING from PwaUpdatePrompt to activate the new SW only after user confirms.
// Never call skipWaiting() unconditionally — that causes split-brain across open tabs.
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data && (event.data as Record<string, unknown>)['type'] === 'SKIP_WAITING') {
    void self.skipWaiting()
  }
})

// Take control of all open clients immediately after activation.
clientsClaim()

// Precache all build artifacts (JS/CSS chunks, index.html, icons, fonts).
// vite-plugin-pwa replaces self.__WB_MANIFEST with the real entry array at build time.
precacheAndRoute(self.__WB_MANIFEST)

// Remove caches from previous SW versions that are no longer used.
cleanupOutdatedCaches()

// SPA navigation fallback: any navigate request not matched by precache falls back to
// index.html so React Router can handle client-side routing.
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')))

// Static assets (fonts, images) — CacheFirst with a 30-day TTL.
// These are content-addressed (hashed filenames), so serving from cache is always correct.
registerRoute(
  ({ request }: { request: Request }) =>
    request.destination === 'font' || request.destination === 'image',
  new CacheFirst({
    cacheName: 'static-assets-v1',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
)

// API GET requests — NetworkFirst with a 10-second timeout.
// Financial data must be fresh; fall back to cached data only when offline.
// Mutations (POST/PUT/DELETE) are never intercepted.
const apiBase: string = import.meta.env.VITE_API_BASE_URL ?? ''

if (apiBase) {
  registerRoute(
    ({ url, request }: { url: URL; request: Request }) =>
      url.href.startsWith(apiBase) && request.method === 'GET',
    new NetworkFirst({
      cacheName: 'api-responses-v1',
      networkTimeoutSeconds: 10,
      plugins: [
        new ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 5 * 60,
        }),
        new CacheableResponsePlugin({ statuses: [200] }),
      ],
    })
  )
}
