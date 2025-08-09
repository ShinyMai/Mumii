"use client";

import { Container, Section, SocialShare } from "@/components";
import { useI18n } from "@/lib/hooks";
import { useFavorites, useOfflineStatus } from "@/lib/offline-hooks";
import { useState } from "react";
import {
  Star,
  MapPin,
  Clock,
  DollarSign,
  Heart,
  Filter,
  Search,
  WifiOff,
} from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  distance: string;
  image: string;
  description: string;
  openHours: string;
  isHiddenGem: boolean;
  mood: string[];
  tags: string[];
  coordinates: { lat: number; lng: number };
}

const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Bún Chả Hương Liên",
    cuisine: "Vietnamese",
    rating: 4.8,
    reviewCount: 1250,
    priceRange: "50,000 - 100,000 VND",
    distance: "0.5 km",
    image: "/api/placeholder/300/200",
    description: "Famous bun cha where Obama dined with Anthony Bourdain",
    openHours: "9:00 AM - 10:00 PM",
    isHiddenGem: true,
    mood: ["traditional", "comfort"],
    tags: ["bun-cha", "famous", "local-favorite"],
    coordinates: { lat: 21.0285, lng: 105.8542 },
  },
  {
    id: "2",
    name: "Madame Hiên",
    cuisine: "Vietnamese Fine Dining",
    rating: 4.6,
    reviewCount: 580,
    priceRange: "200,000 - 400,000 VND",
    distance: "1.1 km",
    image: "/api/placeholder/300/200",
    description:
      "Elegant Vietnamese cuisine in a beautifully restored colonial villa",
    openHours: "11:00 AM - 2:00 PM, 6:00 PM - 10:00 PM",
    isHiddenGem: false,
    mood: ["romantic", "elegant"],
    tags: ["fine-dining", "colonial", "upscale"],
    coordinates: { lat: 21.0245, lng: 105.8525 },
  },
  {
    id: "3",
    name: "Phở Gà Nghĩa Tân",
    cuisine: "Vietnamese",
    rating: 4.7,
    reviewCount: 890,
    priceRange: "30,000 - 60,000 VND",
    distance: "0.3 km",
    image: "/api/placeholder/300/200",
    description: "Best chicken pho in Hanoi, family recipe for 3 generations",
    openHours: "6:00 AM - 10:00 PM",
    isHiddenGem: true,
    mood: ["traditional", "comfort"],
    tags: ["pho", "chicken", "family-recipe"],
    coordinates: { lat: 21.031, lng: 105.852 },
  },
  {
    id: "4",
    name: "Green Tangerine",
    cuisine: "French-Vietnamese Fusion",
    rating: 4.5,
    reviewCount: 670,
    priceRange: "300,000 - 600,000 VND",
    distance: "1.5 km",
    image: "/api/placeholder/300/200",
    description:
      "Innovative fusion cuisine in a charming French colonial house",
    openHours: "12:00 PM - 2:00 PM, 6:30 PM - 10:00 PM",
    isHiddenGem: false,
    mood: ["fine-dining", "romantic"],
    tags: ["fusion", "french", "colonial"],
    coordinates: { lat: 21.028, lng: 105.848 },
  },
  {
    id: "5",
    name: "Bánh Cuốn Bà Xuân",
    cuisine: "Vietnamese",
    rating: 4.5,
    reviewCount: 320,
    priceRange: "25,000 - 50,000 VND",
    distance: "0.8 km",
    image: "/api/placeholder/300/200",
    description:
      "Traditional rice rolls with the most delicate texture in Hanoi",
    openHours: "7:00 AM - 11:00 AM",
    isHiddenGem: true,
    mood: ["traditional", "authentic"],
    tags: ["banh-cuon", "breakfast", "traditional"],
    coordinates: { lat: 21.032, lng: 105.851 },
  },
  {
    id: "6",
    name: "Cầu Gỗ Restaurant",
    cuisine: "Vietnamese Seafood",
    rating: 4.4,
    reviewCount: 890,
    priceRange: "150,000 - 300,000 VND",
    distance: "2.5 km",
    image: "/api/placeholder/300/200",
    description: "Fresh seafood with stunning lake views and live music",
    openHours: "11:00 AM - 11:00 PM",
    isHiddenGem: false,
    mood: ["casual", "scenic"],
    tags: ["seafood", "lake-view", "live-music"],
    coordinates: { lat: 21.02, lng: 105.845 },
  },
];

export default function ExplorePage() {
  const { t } = useI18n("common");
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isOnline = useOfflineStatus();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMood, setSelectedMood] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const moodOptions = [
    { value: "all", label: "All", icon: "🍽️" },
    { value: "traditional", label: "Traditional", icon: "🏮" },
    { value: "comfort", label: "Comfort", icon: "😌" },
    { value: "romantic", label: "Romantic", icon: "💕" },
    { value: "elegant", label: "Elegant", icon: "✨" },
    { value: "casual", label: "Casual", icon: "😊" },
    { value: "fine-dining", label: "Fine Dining", icon: "🍾" },
    { value: "scenic", label: "Scenic", icon: "🌅" },
    { value: "authentic", label: "Authentic", icon: "🏛️" },
  ];

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
        features: restaurant.tags,
        hours: restaurant.openHours,
        cached: true,
      });
    }
  };

  const filteredRestaurants = mockRestaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMood =
      selectedMood === "all" || restaurant.mood.includes(selectedMood);

    return matchesSearch && matchesMood;
  });
  return (
    <div className="min-h-screen bg-white">
      <Container className="py-6 space-y-6">
        {/* Offline Status Indicator */}
        {!isOnline && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center space-x-2">
            <WifiOff className="w-5 h-5 text-amber-600" />
            <span className="text-amber-800 text-sm">
              {t("offline.message", "You are offline. Showing cached content.")}
            </span>
          </div>
        )}

        {/* Header */}
        <Section>
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              🍽️ {t("explore.title", "Khám phá nhà hàng")}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t(
                "explore.subtitle",
                "Tìm kiếm trải nghiệm ẩm thực hoàn hảo dựa trên tâm trạng và sở thích của bạn"
              )}
            </p>
          </div>
        </Section>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />{" "}
            <input
              type="text"
              placeholder={t("search.placeholder", "Tìm nhà hàng, món ăn...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>{" "}
          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="filter-button flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 text-gray-900" />
              <span className="text-gray-900">
                {t("filter.filters", "Bộ lọc")}
              </span>
            </button>
            <span className="text-sm text-gray-500">
              {filteredRestaurants.length} {t("results", "kết quả")}
            </span>
          </div>
          {/* Mood Filters */}
          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">
                {t("filter.mood", "Tâm trạng")}
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`p-3 rounded-lg text-center transition-colors text-gray-900 ${
                      selectedMood === mood.value
                        ? "bg-orange-100 border-2 border-orange-500 text-orange-700"
                        : "bg-white border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.icon}</div>
                    <div className="text-xs font-medium">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                {restaurant.isHiddenGem && (
                  <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    💎 {t("hiddenGem", "Ngọc ẩn")}
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-lg">{restaurant.name}</h3>
                  <p className="text-sm opacity-90">{restaurant.cuisine}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Rating and Info */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{restaurant.rating}</span>
                    <span className="text-gray-500">
                      ({restaurant.reviewCount})
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{restaurant.distance}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm line-clamp-2">
                  {restaurant.description}
                </p>

                {/* Mood Tags */}
                <div className="flex flex-wrap gap-1">
                  {restaurant.mood.slice(0, 2).map((mood) => (
                    <span
                      key={mood}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                    >
                      {mood}
                    </span>
                  ))}
                </div>

                {/* Price and Hours */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-1 text-sm">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">
                      {restaurant.priceRange}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">
                      {restaurant.openHours}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-2">
                  <button
                    onClick={() => toggleFavorite(restaurant)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isFavorite(restaurant.id)
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavorite(restaurant.id) ? "fill-current" : ""
                      }`}
                    />
                    <span className="text-sm">
                      {isFavorite(restaurant.id)
                        ? t("favorites.saved", "Đã lưu")
                        : t("favorites.save", "Lưu")}
                    </span>
                  </button>

                  <SocialShare
                    title={restaurant.name}
                    description={restaurant.description}
                    hashtags={[
                      "Mumii",
                      "FoodTravel",
                      restaurant.cuisine.replace(/\s+/g, ""),
                    ]}
                    className="scale-90"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {t("search.noResults", "Không tìm thấy nhà hàng nào")}
            </h3>
            <p className="text-gray-600">
              {t(
                "search.tryDifferent",
                "Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc của bạn"
              )}
            </p>{" "}
          </div>
        )}
      </Container>
    </div>
  );
}
