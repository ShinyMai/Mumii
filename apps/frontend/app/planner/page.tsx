"use client";

import { Container, Section } from "@/components";
import { useState } from "react";
import {
  MapPin,
  Users,
  DollarSign,
  Heart,
  ChefHat,
  Star,
  ArrowLeft,
  Share2,
} from "lucide-react";

interface TripPlan {
  budget: number;
  location: string;
  cuisineType: string[];
  groupSize: number;
  groupType: string;
  mood: string;
  duration: number;
}

interface PlanResult {
  id: string;
  title: string;
  description: string;
  totalBudget: number;
  duration: number;
  activities: Activity[];
  tips: string[];
  estimatedSavings: number;
}

interface Activity {
  id: string;
  time: string;
  type: "restaurant" | "activity" | "transport";
  title: string;
  description: string;
  location: string;
  cost: number;
  rating: number;
  image: string;
  tags: string[];
  coordinates: { lat: number; lng: number };
}

export default function PlannerPage() {
  const [tripPlan, setTripPlan] = useState<TripPlan>({
    budget: 500000,
    location: "",
    cuisineType: [],
    groupSize: 2,
    groupType: "couple",
    mood: "adventurous",
    duration: 1,
  });

  const [planResult, setPlanResult] = useState<PlanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for plan result
  const generateMockPlan = (plan: TripPlan): PlanResult => {
    const mockActivities: Activity[] = [
      {
        id: "1",
        time: "08:00 AM",
        type: "restaurant",
        title: "Phở Gà Nghĩa Tân",
        description:
          "Start your day with authentic Vietnamese breakfast - the best chicken pho in Hanoi",
        location: "2A Đinh Liệt, Hàng Trống, Hoàn Kiếm",
        cost: 45000,
        rating: 4.8,
        image: "/api/placeholder/300/200",
        tags: ["breakfast", "traditional", "pho"],
        coordinates: { lat: 21.031, lng: 105.852 },
      },
      {
        id: "2",
        time: "10:30 AM",
        type: "activity",
        title: "Old Quarter Food Walk",
        description:
          "Explore the vibrant streets and discover hidden food gems with a local guide",
        location: "Hàng Mã Street Area",
        cost: 150000,
        rating: 4.9,
        image: "/api/placeholder/300/200",
        tags: ["walking", "culture", "street-food"],
        coordinates: { lat: 21.0287, lng: 105.8542 },
      },
      {
        id: "3",
        time: "12:30 PM",
        type: "restaurant",
        title: "Bún Chả Hương Liên",
        description:
          "Famous bun cha where Obama dined - a must-try Hanoi specialty",
        location: "24 Lê Văn Hưu, Hai Bà Trưng",
        cost: 80000,
        rating: 4.7,
        image: "/api/placeholder/300/200",
        tags: ["lunch", "famous", "bun-cha"],
        coordinates: { lat: 21.0285, lng: 105.8542 },
      },
      {
        id: "4",
        time: "03:00 PM",
        type: "activity",
        title: "Coffee Culture Experience",
        description:
          "Learn about Vietnamese coffee culture and try unique egg coffee",
        location: "Giang Cafe",
        cost: 60000,
        rating: 4.6,
        image: "/api/placeholder/300/200",
        tags: ["coffee", "culture", "unique"],
        coordinates: { lat: 21.0279, lng: 105.8521 },
      },
      {
        id: "5",
        time: "06:30 PM",
        type: "restaurant",
        title: "Madame Hiên",
        description:
          "Elegant Vietnamese fine dining in a beautiful colonial villa",
        location: "15 Chan Cam, Hàng Trống, Hoàn Kiếm",
        cost: 350000,
        rating: 4.5,
        image: "/api/placeholder/300/200",
        tags: ["dinner", "fine-dining", "romantic"],
        coordinates: { lat: 21.0245, lng: 105.8525 },
      },
      {
        id: "6",
        time: "09:00 PM",
        type: "activity",
        title: "Night Market Food Tour",
        description:
          "End your day exploring local night market street food and desserts",
        location: "Đông Xuân Night Market",
        cost: 100000,
        rating: 4.4,
        image: "/api/placeholder/300/200",
        tags: ["night-market", "desserts", "street-food"],
        coordinates: { lat: 21.0366, lng: 105.8478 },
      },
    ];

    const totalCost = mockActivities.reduce(
      (sum, activity) => sum + activity.cost,
      0
    );
    const savings = plan.budget - totalCost;

    return {
      id: `plan-${Date.now()}`,
      title: `${plan.location || "Hanoi"} Food Adventure`,
      description: `A perfect ${plan.duration}-day culinary journey designed for ${plan.groupSize} ${plan.groupType} seeking ${plan.mood} experiences`,
      totalBudget: totalCost,
      duration: plan.duration,
      activities: mockActivities.slice(0, plan.duration * 4), // 4 activities per day
      tips: [
        "Book restaurants in advance, especially Madame Hiên and Bún Chả Hương Liên",
        "Bring cash as many local places don't accept cards",
        "Try to visit during lunch hours (11:30 AM - 1:30 PM) for better availability",
        "Download Google Translate for easier communication with vendors",
        "Wear comfortable walking shoes for the food tour",
      ],
      estimatedSavings: Math.max(0, savings),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const result = generateMockPlan(tripPlan);
      setPlanResult(result);
      setIsLoading(false);
    }, 2000);
  };

  const handleBackToPlanner = () => {
    setPlanResult(null);
  };

  // If we have a plan result, show it
  if (planResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Container className="py-6">
          {/* Header */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleBackToPlanner}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Planner</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Share2 className="w-4 h-4" />
                <span>Share Plan</span>
              </button>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {planResult.title}
            </h1>
            <p className="text-gray-600 mb-4">{planResult.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {planResult.duration}
                </div>
                <div className="text-sm text-gray-500">Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {(planResult.totalBudget / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-500">Total Cost (VND)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {planResult.activities.length}
                </div>
                <div className="text-sm text-gray-500">Activities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {(planResult.estimatedSavings / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-500">Savings (VND)</div>
              </div>
            </div>
          </div>

          {/* Itinerary */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Itinerary
            </h2>
            <div className="space-y-6">
              {planResult.activities.map((activity, index) => (
                <div key={activity.id} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">
                            {activity.time}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {activity.title}
                          </h3>
                          <div className="flex items-center space-x-1 mb-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">
                              {activity.rating}
                            </span>
                            <span className="text-sm text-gray-400">•</span>
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {activity.location}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {(activity.cost / 1000).toFixed(0)}K VND
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {activity.type.replace("-", " ")}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">
                        {activity.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {activity.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              💡 Pro Tips
            </h2>
            <ul className="space-y-2">
              {planResult.tips.map((tip, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    );
  }

  const cuisineOptions = [
    "Vietnamese",
    "Japanese",
    "Korean",
    "Chinese",
    "Thai",
    "Western",
    "Italian",
    "French",
    "Street Food",
    "Fine Dining",
  ];

  const groupTypes = [
    { value: "couple", label: "Couple", icon: "💑" },
    { value: "friends", label: "Friends", icon: "👥" },
    { value: "business", label: "Business", icon: "💼" },
    { value: "senior", label: "Senior Group", icon: "👴" },
    { value: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
  ];

  const moodOptions = [
    { value: "adventurous", label: "Adventurous", icon: "🌟" },
    { value: "romantic", label: "Romantic", icon: "💕" },
    { value: "relaxed", label: "Relaxed", icon: "😌" },
    { value: "exciting", label: "Exciting", icon: "🔥" },
    { value: "traditional", label: "Traditional", icon: "🏮" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Section background="white">
        <Container>
          <div className="py-6 sm:py-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                🍽️ Plan Your Food Adventure
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
                Tell us your preferences and we will create the perfect culinary
                journey for you
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-w-2xl mx-auto space-y-6"
            >
              {/* Location */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>Location</span>
                </label>{" "}
                <input
                  type="text"
                  value={tripPlan.location}
                  onChange={(e) =>
                    setTripPlan({ ...tripPlan, location: e.target.value })
                  }
                  placeholder="Enter city or district..."
                  className="search-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                />
              </div>
              {/* Budget */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span>Budget per person (VND)</span>
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="100000"
                    max="2000000"
                    step="50000"
                    value={tripPlan.budget}
                    onChange={(e) =>
                      setTripPlan({
                        ...tripPlan,
                        budget: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-center text-lg font-medium text-blue-600">
                    {tripPlan.budget.toLocaleString("vi-VN")} VND
                  </div>
                </div>
              </div>
              {/* Group Size & Type */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                  <Users className="h-5 w-5 text-orange-600" />
                  <span>Group Details</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Group Size
                    </label>{" "}
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={tripPlan.groupSize}
                      onChange={(e) =>
                        setTripPlan({
                          ...tripPlan,
                          groupSize: parseInt(e.target.value),
                        })
                      }
                      className="search-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (days)
                    </label>{" "}
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={tripPlan.duration}
                      onChange={(e) =>
                        setTripPlan({
                          ...tripPlan,
                          duration: parseInt(e.target.value),
                        })
                      }
                      className="search-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {groupTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setTripPlan({ ...tripPlan, groupType: type.value })
                        }
                        className={`p-3 rounded-lg border text-center transition-colors ${
                          tripPlan.groupType === type.value
                            ? "bg-blue-100 border-blue-500 text-blue-700"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="text-xl mb-1">{type.icon}</div>
                        <div className="text-xs font-medium">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Cuisine Preferences */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                  <ChefHat className="h-5 w-5 text-purple-600" />
                  <span>Cuisine Preferences</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {cuisineOptions.map((cuisine) => (
                    <button
                      key={cuisine}
                      type="button"
                      onClick={() => {
                        const newCuisines = tripPlan.cuisineType.includes(
                          cuisine
                        )
                          ? tripPlan.cuisineType.filter((c) => c !== cuisine)
                          : [...tripPlan.cuisineType, cuisine];
                        setTripPlan({ ...tripPlan, cuisineType: newCuisines });
                      }}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        tripPlan.cuisineType.includes(cuisine)
                          ? "bg-purple-100 border-purple-500 text-purple-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-sm font-medium">{cuisine}</div>
                    </button>
                  ))}
                </div>
              </div>
              {/* Mood Selection */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>What is your mood?</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() =>
                        setTripPlan({ ...tripPlan, mood: mood.value })
                      }
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        tripPlan.mood === mood.value
                          ? "bg-red-100 border-red-500 text-red-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-xl mb-1">{mood.icon}</div>
                      <div className="text-xs font-medium">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>{" "}
              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating Your Adventure...</span>
                    </div>
                  ) : (
                    "🚀 Create My Food Adventure"
                  )}
                </button>
              </div>
            </form>
          </div>
        </Container>
      </Section>
    </div>
  );
}
