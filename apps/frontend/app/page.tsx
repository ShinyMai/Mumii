"use client";

import { Container } from "@/components";
import { MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [selectedBudget, setSelectedBudget] = useState("Budget");
  const [selectedLocation, setSelectedLocation] = useState("Vietnam");
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const budgetOptions = [
    "100,000 - 300,000 VND",
    "300,000 - 500,000 VND",
    "500,000 - 1,000,000 VND",
    "1,000,000+ VND",
  ];

  const locationOptions = [
    "Hà Nội",
    "TP. Hồ Chí Minh",
    "Đà Nẵng",
    "Hội An",
    "Nha Trang",
  ];

  const handleBudgetSelect = (budget: string) => {
    setSelectedBudget(budget);
    setShowBudgetModal(false);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setShowLocationModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Add bottom padding for nav */}

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-red-600 px-4 py-8 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
            KHÁM PHÁ ẨM
            <br />
            THỰC ĐỊA
            <br />
            PHƯƠNG
          </h2>
        </div>

        {/* Food illustration */}
        <div className="absolute right-4 top-4 w-28 h-28">
          <div className="relative">
            {/* Bowl */}
            <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-80"></div>
            <div className="absolute top-2 left-2 right-2 bottom-2 bg-orange-200 rounded-full"></div>
            {/* Noodles */}
            <div className="absolute top-4 left-4 right-4 bottom-4 flex items-center justify-center">
              <span className="text-2xl">🍜</span>
            </div>
            {/* Steam */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-white opacity-70">
              <div className="animate-pulse">💨</div>
            </div>
          </div>
        </div>

        {/* Decorative food elements */}
        <div className="absolute top-6 left-36 text-yellow-300 text-xl animate-bounce">
          🌶️
        </div>
        <div className="absolute bottom-6 right-24 text-green-300 text-lg animate-pulse">
          🥬
        </div>
        <div className="absolute top-12 right-12 text-red-300 text-sm animate-bounce">
          🌶️
        </div>
        <div className="absolute bottom-8 left-8 text-yellow-200 text-lg">
          🍋
        </div>
      </div>

      <Container>
        <div className="px-4 py-6 space-y-8">
          {/* Optimization Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Tối ưu hóa lộ trình ăn uống
              </h3>
              <div className="text-4xl">👨‍🍳</div>
            </div>

            {/* Dropdowns */}
            <div className="flex space-x-3 mb-4">
              <div className="relative flex-1">
                <button
                  onClick={() => setShowBudgetModal(true)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between text-left shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-gray-700 font-medium">
                    {selectedBudget}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="relative flex-1">
                <button
                  onClick={() => setShowLocationModal(true)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between text-left shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-gray-700 font-medium">
                    {selectedLocation}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex space-x-3">
              <span className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium border border-orange-200">
                Loại đồ ăn
              </span>
              <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                Người già
              </span>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Bản đồ quán ăn
            </h3>

            <div className="grid grid-cols-4 gap-4 mb-6">
              {/* Food categories */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="text-2xl">🍽️</span>
                </div>
                <span className="text-sm text-gray-700 font-medium">Combo</span>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="text-2xl">🏆</span>
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  Challenge
                </span>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="text-2xl">👨‍🍳</span>
                </div>
                <span className="text-xs text-gray-700 font-medium leading-tight">
                  đế MUMII
                  <br />
                  chọn
                </span>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:shadow-md transition-shadow relative overflow-hidden">
                  {/* Mini map background */}
                  <div className="absolute inset-2 bg-blue-50 rounded-lg">
                    <div className="w-full h-full relative">
                      <MapPin className="w-3 h-3 text-red-500 absolute top-1 left-1" />
                      <MapPin className="w-3 h-3 text-orange-500 absolute top-2 right-1" />
                      <MapPin className="w-3 h-3 text-blue-500 absolute bottom-1 left-2" />
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-700 font-medium">Map</span>
              </div>
            </div>
          </div>

          {/* Nearby Restaurants Section */}
          <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 rounded-2xl p-6 shadow-lg relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <div className="w-full h-full bg-gradient-to-br from-blue-300 to-purple-300 rounded-full"></div>
            </div>

            <div className="relative z-10">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-2xl">🔔</span>
                  <h3 className="text-lg font-bold text-blue-800">TING!</h3>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">
                  QUÁN ĂN Ở GẦN BẠN
                </h4>
                <p className="text-sm text-blue-700">Ăn món từ tính cũ</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Interactive Mini map */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="w-full h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg relative overflow-hidden">
                    {/* Map background */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div key={i} className="border border-blue-200"></div>
                        ))}
                      </div>
                    </div>
                    {/* Location pins with animation */}
                    <MapPin className="w-4 h-4 text-green-500 absolute top-2 left-3 animate-pulse" />
                    <MapPin className="w-4 h-4 text-blue-500 absolute top-3 right-4 animate-bounce" />
                    <MapPin className="w-4 h-4 text-purple-500 absolute bottom-2 left-6 animate-pulse" />
                    <div className="absolute bottom-1 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  </div>
                </div>

                {/* Game Challenge Section */}
                <div className="text-right">
                  <div className="mb-3">
                    <p className="font-bold text-gray-900 text-lg">
                      Game-challenge
                    </p>
                  </div>
                  <div className="flex items-center justify-end space-x-3 mb-2">
                    <div className="relative">
                      <div className="text-5xl animate-bounce">🏃‍♂️</div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="relative">
                      <MapPin className="w-6 h-6 text-red-500 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-sm text-blue-700 font-medium">
                    Tracking bạn bè
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Budget Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Chọn ngân sách
              </h3>
              <button
                onClick={() => setShowBudgetModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              {budgetOptions.map((budget) => (
                <button
                  key={budget}
                  onClick={() => handleBudgetSelect(budget)}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <span className="font-medium text-gray-900">{budget}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Chọn địa điểm</h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              {locationOptions.map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <span className="font-medium text-gray-900">{location}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
