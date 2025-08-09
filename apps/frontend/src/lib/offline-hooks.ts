import { useState, useEffect } from "react";
import { offlineCache, CachedRestaurant } from "./offline-cache";

// Hook for managing favorite restaurants
export function useFavorites() {
  const [favorites, setFavorites] = useState<CachedRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const saved = await offlineCache.getFavoriteRestaurants();
      setFavorites(saved);
    } catch (error) {
      console.error("Failed to load favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (restaurant: CachedRestaurant) => {
    try {
      await offlineCache.saveFavoriteRestaurant(restaurant);
      setFavorites((prev) => [
        ...prev.filter((r) => r.id !== restaurant.id),
        restaurant,
      ]);
    } catch (error) {
      console.error("Failed to add favorite:", error);
    }
  };

  const removeFavorite = async (restaurantId: string) => {
    try {
      await offlineCache.removeFavoriteRestaurant(restaurantId);
      setFavorites((prev) => prev.filter((r) => r.id !== restaurantId));
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  const isFavorite = (restaurantId: string) => {
    return favorites.some((r) => r.id === restaurantId);
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    refresh: loadFavorites,
  };
}

// Hook for offline-first API calls
export function useOfflineApi<T>(
  url: string,
  fetcher: () => Promise<T>,
  ttl?: number
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  useEffect(() => {
    fetchData();
  }, [url]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try cache first
      const cached = await offlineCache.getCachedApiResponse(url);
      if (cached) {
        setData(cached);
        setIsFromCache(true);
        setLoading(false);
        return;
      }

      // Fetch fresh data
      if (navigator.onLine) {
        const freshData = await fetcher();
        setData(freshData);
        setIsFromCache(false);

        // Cache the response
        await offlineCache.cacheApiResponse(url, freshData, ttl);
      } else {
        throw new Error("No internet connection and no cached data available");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    if (navigator.onLine) {
      await fetchData();
    }
  };

  return {
    data,
    loading,
    error,
    isFromCache,
    refresh,
  };
}

// Hook for managing offline status
export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

// Hook for managing cached restaurants
export function useCachedRestaurants() {
  const [restaurants, setRestaurants] = useState<CachedRestaurant[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCached = async () => {
    try {
      setLoading(true);
      const cached = await offlineCache.getAll("restaurants");
      setRestaurants(cached);
    } catch (error) {
      console.error("Failed to load cached restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveRestaurant = async (restaurant: CachedRestaurant) => {
    try {
      await offlineCache.set("restaurants", { ...restaurant, cached: true });
      setRestaurants((prev) => [
        ...prev.filter((r) => r.id !== restaurant.id),
        restaurant,
      ]);
    } catch (error) {
      console.error("Failed to cache restaurant:", error);
    }
  };

  const clearCache = async () => {
    try {
      await offlineCache.clear("restaurants");
      setRestaurants([]);
    } catch (error) {
      console.error("Failed to clear cache:", error);
    }
  };

  useEffect(() => {
    loadCached();
  }, []);

  return {
    restaurants,
    loading,
    saveRestaurant,
    clearCache,
    refresh: loadCached,
  };
}

// Export cache instance for direct use
export { offlineCache };
