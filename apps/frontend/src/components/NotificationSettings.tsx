"use client";

import { useState, useEffect } from "react";
import { useRestaurantAlerts } from "@/lib/notifications";
import { Bell, BellOff, MapPin, Settings } from "lucide-react";

interface NotificationSettingsProps {
  className?: string;
}

export function NotificationSettings({ className }: NotificationSettingsProps) {
  const {
    alertsEnabled,
    enableAlerts,
    disableAlerts,
    nearbyRestaurants,
    location,
    isTracking,
  } = useRestaurantAlerts();

  const [showSettings, setShowSettings] = useState(false);

  const handleToggleAlerts = async () => {
    if (alertsEnabled) {
      disableAlerts();
    } else {
      const success = await enableAlerts();
      if (!success) {
        alert(
          "Unable to enable notifications. Please check your browser settings."
        );
      }
    }
  };

  return (
    <div className={className}>
      {/* Notification Toggle Button */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-full ${
              alertsEnabled ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            {alertsEnabled ? (
              <Bell className="h-5 w-5 text-green-600" />
            ) : (
              <BellOff className="h-5 w-5 text-gray-600" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Restaurant Alerts</h3>
            <p className="text-sm text-gray-600">
              {alertsEnabled
                ? "Get notified when near restaurants"
                : "Enable location-based notifications"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            onClick={handleToggleAlerts}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              alertsEnabled ? "bg-green-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                alertsEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Status Info */}
      {alertsEnabled && (
        <div className="mt-4 space-y-3">
          {/* Location Status */}
          <div className="flex items-center space-x-2 text-sm">
            <MapPin
              className={`h-4 w-4 ${
                location ? "text-green-600" : "text-gray-400"
              }`}
            />
            <span className={location ? "text-green-600" : "text-gray-600"}>
              {location
                ? `Location: ${location.latitude.toFixed(
                    4
                  )}, ${location.longitude.toFixed(4)}`
                : isTracking
                ? "Getting your location..."
                : "Location unavailable"}
            </span>
          </div>

          {/* Nearby Restaurants */}
          {nearbyRestaurants.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-900">
                  {nearbyRestaurants.length} restaurant
                  {nearbyRestaurants.length !== 1 ? "s" : ""} nearby
                </span>
              </div>
              <p className="text-xs text-blue-700">
                You will receive notifications when you are close to recommended
                restaurants
              </p>
            </div>
          )}
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-gray-900">
            Notification Preferences
          </h4>

          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Hidden gems alerts</span>
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                Mood-based recommendations
              </span>
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Challenge updates</span>
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                Group activity notifications
              </span>
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <label className="block text-sm text-gray-700 mb-2">
              Notification radius
            </label>
            <select className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="50">50 meters</option>
              <option value="100" selected>
                100 meters
              </option>
              <option value="200">200 meters</option>
              <option value="500">500 meters</option>
            </select>
          </div>
        </div>
      )}

      {/* Test Notification Button (Development) */}
      {process.env.NODE_ENV === "development" && alertsEnabled && (
        <div className="mt-4">
          <button
            onClick={() => {
              // Test notification
              if ("serviceWorker" in navigator && "Notification" in window) {
                new Notification("🍽️ Test Notification", {
                  body: "This is a test notification from Mumii!",
                  icon: "/icon-192x192.png",
                  tag: "test-notification",
                });
              }
            }}
            className="w-full py-2 px-4 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Send Test Notification
          </button>
        </div>
      )}
    </div>
  );
}
