"use client";

import { Container, Section, GoogleMap, SocialShare } from "@/components";
import { useI18n } from "@/lib/hooks";
import { useFavorites } from "@/lib/offline-hooks";
import { useState } from "react";
import { MapPin, Star, DollarSign, Play, Heart, X } from "lucide-react";

type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  distance: string;
  image: string;
  description: string;
  coordinates: { lat: number; lng: number };
  isHiddenGem: boolean;
  isFavorite: boolean;
};

const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Bún Chả Hương Liên",
    cuisine: "Vietnamese",
    rating: 4.8,
    priceRange: "50,000 - 100,000 VND",
    distance: "0.5 km",
    image: "/api/placeholder/300/200",
    description: "Famous bun cha where Obama dined with Anthony Bourdain",
    coordinates: { lat: 21.0285, lng: 105.8542 },
    isHiddenGem: true,
    isFavorite: false,
  },
  {
    id: "2",
    name: "Madame Hiên",
    cuisine: "Vietnamese Fusion",
    rating: 4.6,
    priceRange: "200,000 - 500,000 VND",
    distance: "1.2 km",
    image: "/api/placeholder/300/200",
    description: "Elegant Vietnamese cuisine in a French colonial villa",
    coordinates: { lat: 21.0245, lng: 105.8412 },
    isHiddenGem: false,
    isFavorite: false,
  },
  {
    id: "3",
    name: "Phở Gà Nghĩa Tân",
    cuisine: "Vietnamese",
    rating: 4.9,
    priceRange: "30,000 - 60,000 VND",
    distance: "2.1 km",
    image: "/api/placeholder/300/200",
    description:
      "Best chicken pho in the old quarter, family recipe since 1960s",
    coordinates: { lat: 21.0375, lng: 105.8485 },
    isHiddenGem: true,
    isFavorite: true,
  },
  {
    id: "4",
    name: "Green Tangerine",
    cuisine: "French-Vietnamese",
    rating: 4.7,
    priceRange: "400,000 - 800,000 VND",
    distance: "1.8 km",
    image: "/api/placeholder/300/200",
    description:
      "Refined French cuisine with Vietnamese influences in a colonial mansion",
    coordinates: { lat: 21.0291, lng: 105.8521 },
    isHiddenGem: false,
    isFavorite: false,
  },
  {
    id: "5",
    name: "Bánh Cuốn Bà Xuân",
    cuisine: "Vietnamese",
    rating: 4.5,
    priceRange: "25,000 - 50,000 VND",
    distance: "0.8 km",
    image: "/api/placeholder/300/200",
    description:
      "Traditional rice rolls with the most delicate texture in Hanoi",
    coordinates: { lat: 21.032, lng: 105.851 },
    isHiddenGem: true,
    isFavorite: false,
  },
  {
    id: "6",
    name: "Cầu Gỗ Restaurant",
    cuisine: "Vietnamese Seafood",
    rating: 4.4,
    priceRange: "150,000 - 300,000 VND",
    distance: "2.5 km",
    image: "/api/placeholder/300/200",
    description: "Fresh seafood with stunning lake views and live music",
    coordinates: { lat: 21.02, lng: 105.845 },
    isHiddenGem: false,
    isFavorite: false,
  },
];

export default function MapPage() {
  const { t } = useI18n("common");
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [showHiddenGemsOnly, setShowHiddenGemsOnly] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);

  const filteredRestaurants = mockRestaurants
    .filter((restaurant) => {
      const hiddenGemFilter = !showHiddenGemsOnly || restaurant.isHiddenGem;
      const cuisineFilter =
        selectedCuisine === "all" ||
        restaurant.cuisine
          .toLowerCase()
          .includes(selectedCuisine.toLowerCase());
      const ratingFilter = restaurant.rating >= minRating;

      return hiddenGemFilter && cuisineFilter && ratingFilter;
    })
    .map((restaurant) => ({
      ...restaurant,
      isFavorite: isFavorite(restaurant.id),
    }));

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const toggleFavorite = async (restaurant: Restaurant) => {
    if (isFavorite(restaurant.id)) {
      await removeFavorite(restaurant.id);
    } else {
      await addFavorite({
        id: restaurant.id,
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        location: restaurant.distance,
        rating: restaurant.rating,
        priceRange: restaurant.priceRange,
        coordinates: restaurant.coordinates,
        image: restaurant.image,
        description: restaurant.description,
        features: [],
        hours: "9:00 AM - 10:00 PM",
        cached: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Section background="white">
        <Container>
          <div className="py-4 sm:py-6">
            <div className="text-center mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                🗺️ Interactive Food Map
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                Discover hidden culinary gems around you
              </p>
            </div>{" "}
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              <button
                onClick={() => setShowHiddenGemsOnly(!showHiddenGemsOnly)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  showHiddenGemsOnly
                    ? "bg-purple-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                💎 Hidden Gems Only
              </button>
              <button
                onClick={() =>
                  setSelectedCuisine(
                    selectedCuisine === "vietnamese" ? "all" : "vietnamese"
                  )
                }
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCuisine === "vietnamese"
                    ? "bg-green-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                🍜 Vietnamese
              </button>
              <button
                onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  minRating === 4.5
                    ? "bg-yellow-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                ⭐ 4.5+ Rating
              </button>
            </div>
            {/* Interactive Google Map */}
            <div className="relative rounded-xl mb-6 overflow-hidden shadow-lg text-gray-900">
              <GoogleMap
                restaurants={filteredRestaurants}
                center={{ lat: 21.0285, lng: 105.8542 }}
                onRestaurantSelect={handleRestaurantSelect}
                className="h-64 sm:h-80 md:h-96"
              />
            </div>
            {/* Restaurant Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className={`bg-white rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md ${
                    selectedRestaurant?.id === restaurant.id
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                  onClick={() => setSelectedRestaurant(restaurant)}
                >
                  {/* Restaurant Image */}
                  <div className="relative">
                    <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <span className="text-4xl">🍜</span>
                    </div>
                    {restaurant.isHiddenGem && (
                      <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        💎 Hidden Gem
                      </div>
                    )}
                    <button className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity">
                      <Play className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Restaurant Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {restaurant.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {restaurant.cuisine}
                    </p>
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">
                        {restaurant.rating}
                      </span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        {restaurant.distance}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 mb-3">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600">
                        {restaurant.priceRange}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {restaurant.description}
                    </p>{" "}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedRestaurant(restaurant)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Xem chi tiết
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(restaurant);
                        }}
                        className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                          isFavorite(restaurant.id)
                            ? "bg-red-100 text-red-600 border border-red-200"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            isFavorite(restaurant.id)
                              ? "fill-current text-red-600"
                              : "text-gray-600"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Selected Restaurant Popup */}
            {selectedRestaurant && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-4">
                <div className="bg-white rounded-t-xl sm:rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedRestaurant.name}
                      </h2>{" "}
                      <button
                        onClick={() => setSelectedRestaurant(null)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-6xl">🍜</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        <span className="font-medium">
                          {selectedRestaurant.rating}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">
                          {selectedRestaurant.cuisine}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {selectedRestaurant.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-600">
                            {selectedRestaurant.distance} away
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-600">
                            {selectedRestaurant.priceRange}
                          </span>
                        </div>
                      </div>{" "}
                      <div className="flex space-x-2 pt-4">
                        <button
                          onClick={() => toggleFavorite(selectedRestaurant)}
                          className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                            isFavorite(selectedRestaurant.id)
                              ? "bg-red-100 text-red-600 border border-red-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isFavorite(selectedRestaurant.id)
                                ? "fill-current"
                                : ""
                            }`}
                          />
                          <span className="text-sm">
                            {isFavorite(selectedRestaurant.id)
                              ? "Đã lưu"
                              : "Lưu"}
                          </span>
                        </button>

                        <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                          Chỉ đường
                        </button>
                      </div>
                      <div className="mt-4">
                        <SocialShare
                          title={selectedRestaurant.name}
                          description={selectedRestaurant.description}
                          hashtags={[
                            "Mumii",
                            "FoodTravel",
                            selectedRestaurant.cuisine.replace(/\s+/g, ""),
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </div>
  );
}
