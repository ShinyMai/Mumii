/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Container, Section } from "@/components";
import { useI18n } from "@/lib/hooks";
import { useState } from "react";
import { Clock, Users, Trophy, MapPin, CheckCircle } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "time-travel" | "discovery" | "group";
  difficulty: "easy" | "medium" | "hard";
  duration: string;
  points: number;
  participants: number;
  progress: number;
  isCompleted: boolean;
  location: string;
  icon: string;
}

const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Time Travel: Hanoi 1960s",
    description:
      "Visit traditional restaurants that have been serving the same recipes since the 1960s",
    type: "time-travel",
    difficulty: "medium",
    duration: "2-3 hours",
    points: 150,
    participants: 4,
    progress: 60,
    isCompleted: false,
    location: "Old Quarter, Hanoi",
    icon: "🕰️",
  },
  {
    id: "2",
    title: "Hidden Gem Hunter",
    description: "Discover 5 hidden local eateries that only locals know about",
    type: "discovery",
    difficulty: "hard",
    duration: "1 day",
    points: 300,
    participants: 2,
    progress: 80,
    isCompleted: false,
    location: "District 1, Ho Chi Minh",
    icon: "💎",
  },
  {
    id: "3",
    title: "Street Food Marathon",
    description: "Try 10 different street food dishes in one evening",
    type: "group",
    difficulty: "easy",
    duration: "3-4 hours",
    points: 100,
    participants: 6,
    progress: 100,
    isCompleted: true,
    location: "Ben Thanh Market Area",
    icon: "🏃‍♂️",
  },
  {
    id: "4",
    title: "Exotic Taste Adventure",
    description: "Challenge yourself to try unusual Vietnamese delicacies",
    type: "discovery",
    difficulty: "hard",
    duration: "2-3 hours",
    points: 250,
    participants: 3,
    progress: 20,
    isCompleted: false,
    location: "Various locations",
    icon: "🐉",
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "text-green-600 bg-green-100";
    case "medium":
      return "text-yellow-600 bg-yellow-100";
    case "hard":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "time-travel":
      return "text-purple-600 bg-purple-100";
    case "discovery":
      return "text-blue-600 bg-blue-100";
    case "group":
      return "text-orange-600 bg-orange-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export default function ChallengesPage() {
  const { t } = useI18n("common");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<
    "active" | "completed" | "available"
  >("active");

  const activeChallenges = mockChallenges.filter(
    (c) => !c.isCompleted && c.progress > 0
  );
  const completedChallenges = mockChallenges.filter((c) => c.isCompleted);
  const availableChallenges = mockChallenges.filter(
    (c) => !c.isCompleted && c.progress === 0
  );

  const getCurrentChallenges = () => {
    switch (activeTab) {
      case "active":
        return activeChallenges;
      case "completed":
        return completedChallenges;
      case "available":
        return availableChallenges;
      default:
        return activeChallenges;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Section background="white">
        <Container>
          <div className="py-6 sm:py-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                🎮 Food Challenges
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
                Complete exciting challenges and discover amazing food
                experiences
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-600">Total Challenges</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-purple-600">850</div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-orange-600">#47</div>
                <div className="text-sm text-gray-600">Rank</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 mb-6">
              {[
                { key: "active", label: `Active (${activeChallenges.length})` },
                {
                  key: "available",
                  label: `Available (${availableChallenges.length})`,
                },
                {
                  key: "completed",
                  label: `Completed (${completedChallenges.length})`,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Challenge Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {getCurrentChallenges().map((challenge) => (
                <div
                  key={challenge.id}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedChallenge(challenge)}
                >
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{challenge.icon}</span>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {challenge.title}
                          </h3>
                          <div className="flex items-center space-x-1 mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                                challenge.type
                              )}`}
                            >
                              {challenge.type.replace("-", " ")}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                challenge.difficulty
                              )}`}
                            >
                              {challenge.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                      {challenge.isCompleted && (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4">
                      {challenge.description}
                    </p>

                    {/* Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>{challenge.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{challenge.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        <span>{challenge.participants} participants</span>
                      </div>
                    </div>

                    {/* Progress */}
                    {challenge.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            Progress
                          </span>
                          <span className="text-sm text-gray-500">
                            {challenge.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${challenge.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Points */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {challenge.points} points
                        </span>
                      </div>
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          challenge.isCompleted
                            ? "bg-green-100 text-green-700"
                            : challenge.progress > 0
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {challenge.isCompleted
                          ? "Completed"
                          : challenge.progress > 0
                          ? "Continue"
                          : "Start"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Challenge Detail Modal */}
            {selectedChallenge && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-4">
                <div className="bg-white rounded-t-xl sm:rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">
                          {selectedChallenge.icon}
                        </span>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            {selectedChallenge.title}
                          </h2>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                                selectedChallenge.type
                              )}`}
                            >
                              {selectedChallenge.type.replace("-", " ")}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                selectedChallenge.difficulty
                              )}`}
                            >
                              {selectedChallenge.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedChallenge(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-4">
                      <p className="text-gray-600">
                        {selectedChallenge.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-700">
                              Location
                            </div>
                            <div className="text-sm text-gray-500">
                              {selectedChallenge.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-green-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-700">
                              Duration
                            </div>
                            <div className="text-sm text-gray-500">
                              {selectedChallenge.duration}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-5 w-5 text-orange-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-700">
                              Participants
                            </div>
                            <div className="text-sm text-gray-500">
                              {selectedChallenge.participants} people
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Trophy className="h-5 w-5 text-yellow-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-700">
                              Reward
                            </div>
                            <div className="text-sm text-gray-500">
                              {selectedChallenge.points} points
                            </div>
                          </div>
                        </div>
                      </div>

                      {selectedChallenge.progress > 0 && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Your Progress
                            </span>
                            <span className="text-sm text-gray-500">
                              {selectedChallenge.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${selectedChallenge.progress}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2 pt-4">
                        <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                          {selectedChallenge.isCompleted
                            ? "View Details"
                            : selectedChallenge.progress > 0
                            ? "Continue Challenge"
                            : "Start Challenge"}
                        </button>
                        <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                          Share
                        </button>
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
