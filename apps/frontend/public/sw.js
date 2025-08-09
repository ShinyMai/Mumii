// Service Worker for Push Notifications and Geofencing
const CACHE_NAME = "mumii-v1";
const urlsToCache = ["/", "/static/js/bundle.js", "/static/css/main.css"];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});

// Push notification event
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};

  const options = {
    body: data.body || "You have a new notification from Mumii!",
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    image: data.image,
    data: {
      url: data.url || "/",
      restaurantId: data.restaurantId,
      type: data.type || "general",
    },
    actions: [
      {
        action: "view",
        title: "View Details",
        icon: "/action-view.png",
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/action-dismiss.png",
      },
    ],
    requireInteraction: true,
    silent: false,
    vibrate: [200, 100, 200],
    tag: data.tag || "mumii-notification",
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "Mumii Food Adventure",
      options
    )
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "view") {
    // Open the app to the specific page
    event.waitUntil(clients.openWindow(event.notification.data.url));
  } else if (event.action === "dismiss") {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow("/"));
  }
});

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Sync offline actions when back online
  console.log("Background sync triggered");
}

// Geofencing simulation (would integrate with real geolocation APIs)
function checkGeofencing(latitude, longitude) {
  // Mock restaurant locations for demo
  const restaurants = [
    {
      id: "1",
      lat: 21.0285,
      lng: 105.8542,
      name: "Bún Chả Hương Liên",
      radius: 100,
    },
    { id: "2", lat: 21.0245, lng: 105.8412, name: "Madame Hiên", radius: 150 },
    {
      id: "3",
      lat: 21.0375,
      lng: 105.8485,
      name: "Phở Gà Nghĩa Tân",
      radius: 80,
    },
  ];

  restaurants.forEach((restaurant) => {
    const distance = calculateDistance(
      latitude,
      longitude,
      restaurant.lat,
      restaurant.lng
    );

    if (distance <= restaurant.radius) {
      // User is near restaurant - trigger notification
      triggerLocationNotification(restaurant);
    }
  });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

function triggerLocationNotification(restaurant) {
  const notificationData = {
    title: `🍽️ You're near ${restaurant.name}!`,
    body: `Discover amazing food just ${restaurant.radius}m away. Tap to see menu and reviews.`,
    url: `/explore?restaurant=${restaurant.id}`,
    restaurantId: restaurant.id,
    type: "geofencing",
    tag: `location-${restaurant.id}`,
  };

  self.registration.showNotification(notificationData.title, {
    body: notificationData.body,
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    data: notificationData,
    actions: [
      { action: "view", title: "View Restaurant" },
      { action: "dismiss", title: "Not Now" },
    ],
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 200],
    tag: notificationData.tag,
  });
}

// Listen for location updates from main thread
self.addEventListener("message", (event) => {
  if (event.data.type === "LOCATION_UPDATE") {
    const { latitude, longitude } = event.data;
    checkGeofencing(latitude, longitude);
  }
});
