"use client";

import { useState, useEffect, useRef } from "react";

interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface UseNotificationsReturn {
  permission: NotificationPermission;
  requestPermission: () => Promise<boolean>;
  sendNotification: (title: string, options?: NotificationOptions) => void;
  isSupported: boolean;
}

interface UseGeolocationReturn {
  location: GeolocationData | null;
  error: string | null;
  loading: boolean;
  startTracking: () => void;
  stopTracking: () => void;
  isTracking: boolean;
}

// Hook for Push Notifications
export function useNotifications(): UseNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    default: true,
  });

  const isSupported =
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator;

  useEffect(() => {
    if (isSupported) {
      updatePermissionState();
      registerServiceWorker();
    }
  }, [isSupported]);

  const updatePermissionState = () => {
    const perm = Notification.permission;
    setPermission({
      granted: perm === "granted",
      denied: perm === "denied",
      default: perm === "default",
    });
  };

  const registerServiceWorker = async () => {
    try {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registered:", registration);
      }
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      updatePermissionState();
      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!isSupported || !permission.granted) {
      console.warn("Notifications not supported or permission not granted");
      return;
    }

    const defaultOptions: NotificationOptions = {
      icon: "/icon-192x192.png",
      badge: "/badge-72x72.png",
      requireInteraction: true,
      ...options,
    };

    new Notification(title, defaultOptions);
  };

  return {
    permission,
    requestPermission,
    sendNotification,
    isSupported,
  };
}

// Hook for Geolocation and Geofencing
export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  const isSupported =
    typeof window !== "undefined" && "geolocation" in navigator;

  const startTracking = () => {
    if (!isSupported) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    setLoading(true);
    setError(null);
    setIsTracking(true);

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // Cache position for 1 minute
    };

    const successCallback = (position: GeolocationPosition) => {
      const locationData: GeolocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      };

      setLocation(locationData);
      setError(null);
      setLoading(false);

      // Send location to service worker for geofencing
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "LOCATION_UPDATE",
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        });
      }
    };

    const errorCallback = (error: GeolocationPositionError) => {
      let errorMessage = "An unknown error occurred";

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location access denied by user";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out";
          break;
      }

      setError(errorMessage);
      setLoading(false);
    };

    // Start watching position
    watchIdRef.current = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      options
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setLoading(false);
  };

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  return {
    location,
    error,
    loading,
    startTracking,
    stopTracking,
    isTracking,
  };
}

// Hook for combining notifications and geolocation for restaurant alerts
export function useRestaurantAlerts() {
  const { permission, requestPermission, sendNotification } =
    useNotifications();
  const { location, startTracking, stopTracking, isTracking } =
    useGeolocation();

  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<string[]>([]);

  // Mock restaurant data for geofencing
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

  const enableAlerts = async () => {
    if (!permission.granted) {
      const granted = await requestPermission();
      if (!granted) {
        alert("Please enable notifications to receive restaurant alerts");
        return false;
      }
    }

    startTracking();
    setAlertsEnabled(true);
    return true;
  };

  const disableAlerts = () => {
    stopTracking();
    setAlertsEnabled(false);
    setNearbyRestaurants([]);
  };

  // Check for nearby restaurants when location changes
  useEffect(() => {
    if (!location || !alertsEnabled) return;

    const nearby: string[] = [];

    restaurants.forEach((restaurant) => {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        restaurant.lat,
        restaurant.lng
      );

      if (distance <= restaurant.radius) {
        nearby.push(restaurant.id);

        // Send notification if not already notified
        if (!nearbyRestaurants.includes(restaurant.id)) {
          sendNotification(`🍽️ You're near ${restaurant.name}!`, {
            body: `Discover amazing food just ${Math.round(
              distance
            )}m away. Tap to explore!`,
            tag: `restaurant-${restaurant.id}`,
            data: {
              restaurantId: restaurant.id,
              url: `/explore?restaurant=${restaurant.id}`,
            },
          });
        }
      }
    });

    setNearbyRestaurants(nearby);
  }, [location, alertsEnabled, sendNotification]);

  return {
    alertsEnabled,
    enableAlerts,
    disableAlerts,
    nearbyRestaurants,
    location,
    isTracking,
  };
}

// Utility function to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
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
