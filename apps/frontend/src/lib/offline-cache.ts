/* eslint-disable @typescript-eslint/no-explicit-any */
// IndexedDB wrapper for offline caching
class OfflineCache {
  private dbName = "MumiiCache";
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create stores for different data types
        if (!db.objectStoreNames.contains("restaurants")) {
          const restaurantStore = db.createObjectStore("restaurants", {
            keyPath: "id",
          });
          restaurantStore.createIndex("location", "location", {
            unique: false,
          });
          restaurantStore.createIndex("cuisine", "cuisine", { unique: false });
        }

        if (!db.objectStoreNames.contains("itineraries")) {
          db.createObjectStore("itineraries", { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains("challenges")) {
          db.createObjectStore("challenges", { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains("user_data")) {
          db.createObjectStore("user_data", { keyPath: "key" });
        }

        if (!db.objectStoreNames.contains("api_cache")) {
          const cacheStore = db.createObjectStore("api_cache", {
            keyPath: "url",
          });
          cacheStore.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
    });
  }

  async set(storeName: string, data: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async get(storeName: string, key: any): Promise<any> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getAll(storeName: string): Promise<any[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async delete(storeName: string, key: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clear(storeName: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // Cache API responses with timestamp
  async cacheApiResponse(
    url: string,
    data: any,
    ttl: number = 5 * 60 * 1000
  ): Promise<void> {
    const cacheEntry = {
      url,
      data,
      timestamp: Date.now(),
      ttl,
    };
    await this.set("api_cache", cacheEntry);
  }

  // Get cached API response if not expired
  async getCachedApiResponse(url: string): Promise<any | null> {
    const cached = await this.get("api_cache", url);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      await this.delete("api_cache", url);
      return null;
    }

    return cached.data;
  }

  // Save user favorites
  async saveFavoriteRestaurant(restaurant: any): Promise<void> {
    const favorites = (await this.getUserData("favorites")) || [];
    const updated = [
      ...favorites.filter((r: any) => r.id !== restaurant.id),
      restaurant,
    ];
    await this.setUserData("favorites", updated);
  }

  async removeFavoriteRestaurant(restaurantId: string): Promise<void> {
    const favorites = (await this.getUserData("favorites")) || [];
    const updated = favorites.filter((r: any) => r.id !== restaurantId);
    await this.setUserData("favorites", updated);
  }

  async getFavoriteRestaurants(): Promise<any[]> {
    return (await this.getUserData("favorites")) || [];
  }

  // User data helpers
  async setUserData(key: string, value: any): Promise<void> {
    await this.set("user_data", { key, value });
  }

  async getUserData(key: string): Promise<any> {
    const result = await this.get("user_data", key);
    return result?.value;
  }

  // Clean up expired cache entries
  async cleanExpiredCache(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["api_cache"], "readwrite");
      const store = transaction.objectStore("api_cache");
      const request = store.openCursor();

      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          const entry = cursor.value;
          const isExpired = Date.now() - entry.timestamp > entry.ttl;
          if (isExpired) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }
}

// Create singleton instance
export const offlineCache = new OfflineCache();

// Initialize on first import
if (typeof window !== "undefined") {
  offlineCache.init().catch(console.error);
}

// Types
export interface CachedRestaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  priceRange: string;
  coordinates: { lat: number; lng: number };
  image: string;
  description: string;
  features: string[];
  hours: string;
  cached: boolean;
}

export interface CachedItinerary {
  id: string;
  name: string;
  restaurants: string[];
  budget: number;
  duration: number;
  createdAt: number;
  userId?: string;
}
