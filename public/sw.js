const CACHE_NAME = "ahmed-steels-v1";
const urlsToCache = [
  "/",
  "/admin/dashboard",
  "/admin/sales",
  "/admin/enquiries",
  "/manifest.json",
];

// Install event - cache resources
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Push event - show notification
self.addEventListener("push", event => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const title = data.title || "Ahmed Steels";
  const options = {
    body: data.body || "You have a new notification",
    icon: data.icon || "/android/android-launchericon-192-192.png",
    badge: data.badge || "/badge-72x72.png",
    tag: data.tag || "notification",
    data: data.data || {},
    vibrate: [200, 100, 200],
    requireInteraction: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event - open the app
self.addEventListener("notificationclick", event => {
  event.notification.close();

  const urlToOpen = event.notification.data.url || "/admin/dashboard";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(clientList => {
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
