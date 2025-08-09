/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useI18n } from "@/lib/hooks";
import { MapPin, Navigation, Star, Heart } from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  distance: string;
  coordinates: { lat: number; lng: number };
  image: string;
  description: string;
  isHiddenGem: boolean;
  isFavorite: boolean;
}

interface GoogleMapProps {
  restaurants: Restaurant[];
  center?: { lat: number; lng: number };
  onRestaurantSelect?: (restaurant: Restaurant) => void;
  className?: string;
}

export function GoogleMap({
  restaurants,
  center = { lat: 10.762622, lng: 106.660172 },
  onRestaurantSelect,
  className = "",
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const { t } = useI18n();
  // Initialize Google Maps
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // If no valid API key, show fallback map
    if (!apiKey || apiKey === "demo-key") {
      setIsLoaded(true);
      return;
    }

    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places"],
    });

    loader
      .load()
      .then(() => {
        if (mapRef.current && !mapInstanceRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center,
            zoom: 14,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });

          mapInstanceRef.current = map;
          infoWindowRef.current = new google.maps.InfoWindow();
          setIsLoaded(true);

          // Get user location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const userPos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                setUserLocation(userPos);

                // Add user location marker
                new google.maps.Marker({
                  position: userPos,
                  map,
                  icon: {
                    url:
                      "data:image/svg+xml;charset=UTF-8," +
                      encodeURIComponent(`
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
                      <circle cx="12" cy="12" r="3" fill="white"/>
                    </svg>
                  `),
                    scaledSize: new google.maps.Size(24, 24),
                    anchor: new google.maps.Point(12, 12),
                  },
                  title: "Your Location",
                });

                // Recenter map to user location
                map.setCenter(userPos);
              },
              (error) => {
                console.error("Geolocation error:", error);
              }
            );
          }
        }
      })
      .catch(console.error);
  }, [center]);

  // Add restaurant markers
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    restaurants.forEach((restaurant) => {
      if (!mapInstanceRef.current) return;

      const marker = new google.maps.Marker({
        position: restaurant.coordinates,
        map: mapInstanceRef.current,
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 16 16 24 16 24s16-8 16-24c0-8.837-7.163-16-16-16z" fill="${
                restaurant.isHiddenGem ? "#FFD700" : "#FF6B35"
              }"/>
              <circle cx="16" cy="16" r="8" fill="white"/>
              <text x="16" y="20" text-anchor="middle" font-family="Arial" font-size="12" fill="${
                restaurant.isHiddenGem ? "#FFD700" : "#FF6B35"
              }">
                ${restaurant.isHiddenGem ? "💎" : "🍽️"}
              </text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 40),
          anchor: new google.maps.Point(16, 40),
        },
        title: restaurant.name,
      });

      // Add click listener
      marker.addListener("click", () => {
        if (!infoWindowRef.current || !mapInstanceRef.current) return;

        const content = `
          <div class="p-4 max-w-sm">
            <div class="flex items-start space-x-3">
              <img src="${restaurant.image}" alt="${
          restaurant.name
        }" class="w-20 h-20 rounded-lg object-cover" />
              <div class="flex-1">
                <h3 class="font-bold text-lg text-gray-900 mb-1">${
                  restaurant.name
                }</h3>
                <p class="text-sm text-gray-600 mb-2">${restaurant.cuisine}</p>
                <div class="flex items-center space-x-2 mb-2">
                  <div class="flex items-center space-x-1">
                    <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span class="font-medium">${restaurant.rating}</span>
                  </div>
                  <span class="text-gray-500">•</span>
                  <span class="text-green-600 text-sm">${
                    restaurant.priceRange
                  }</span>
                </div>
                <p class="text-sm text-gray-600 line-clamp-2">${
                  restaurant.description
                }</p>
                <div class="mt-3 space-y-2">
                  <button 
                    onclick="selectRestaurant('${restaurant.id}')"
                    class="w-full bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                  >
                    ${t("viewDetails", "View Details")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;

        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(mapInstanceRef.current, marker);

        // Add global function for button click
        (window as any).selectRestaurant = (id: string) => {
          const selectedRestaurant = restaurants.find((r) => r.id === id);
          if (selectedRestaurant && onRestaurantSelect) {
            onRestaurantSelect(selectedRestaurant);
          }
        };
      });

      markersRef.current.push(marker);
    });
  }, [isLoaded, restaurants, onRestaurantSelect, t]);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const hasValidApiKey = apiKey && apiKey !== "demo-key";

  // Fallback map when no API key is available
  if (!hasValidApiKey) {
    return (
      <div className={`relative ${className}`}>
        <div
          className="w-full h-full rounded-lg bg-gradient-to-br from-green-100 to-blue-100 border-2 border-gray-200"
          style={{ minHeight: "400px" }}
        >
          {/* Fallback Map Header */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-3 py-2">
            <h3 className="font-medium text-gray-800 text-sm">
              📍 Hanoi Food Map
            </h3>
          </div>

          {/* Restaurant Markers */}
          <div className="relative w-full h-full">
            {restaurants.map((restaurant, index) => {
              // Calculate position based on restaurant coordinates
              const xPos = 20 + (index % 3) * 30; // Spread horizontally
              const yPos = 30 + Math.floor(index / 3) * 25; // Stack vertically

              return (
                <div
                  key={restaurant.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${xPos}%`,
                    top: `${yPos}%`,
                  }}
                  onClick={() => onRestaurantSelect?.(restaurant)}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white ${
                      restaurant.isHiddenGem ? "bg-yellow-500" : "bg-orange-500"
                    }`}
                  >
                    {restaurant.isHiddenGem ? "💎" : "🍽️"}
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white rounded px-2 py-1 shadow-md text-xs font-medium whitespace-nowrap">
                    {restaurant.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Demo Notice */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 max-w-xs">
            <p className="text-xs text-gray-600">
              🗺️ Demo Map - Add Google Maps API key for full functionality
            </p>
          </div>

          {/* Controls */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2">
            <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
              <Navigation className="w-4 h-4" />
              <span className="hidden sm:inline">Location</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg"
        style={{ minHeight: "400px" }}
      />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
            <p className="text-gray-600">{t("loadingMap", "Loading map...")}</p>
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2 space-y-2">
        <button
          onClick={() => {
            if (userLocation && mapInstanceRef.current) {
              mapInstanceRef.current.setCenter(userLocation);
              mapInstanceRef.current.setZoom(16);
            }
          }}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          title={t("goToMyLocation", "Go to my location")}
        >
          <Navigation className="w-4 h-4" />
          <span className="hidden sm:inline">
            {t("myLocation", "My Location")}
          </span>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
        <h4 className="font-medium text-gray-900 mb-2 text-sm">
          {t("mapLegend", "Legend")}
        </h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
            <span>{t("restaurants", "Restaurants")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span>{t("hiddenGems", "Hidden Gems")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>{t("yourLocation", "Your Location")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
