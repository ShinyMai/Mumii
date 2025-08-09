import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data
const mockRestaurants = [
  {
    id: "1",
    name: "Bánh Mì Phượng",
    cuisine: "Vietnamese Street Food",
    rating: 4.8,
    reviewCount: 1250,
    priceRange: "20,000 - 40,000 VND",
    coordinates: { lat: 21.0285, lng: 105.8542 },
    distance: "0.3 km",
    isHiddenGem: false,
    mood: ["quick", "casual"],
    tags: ["street-food", "banh-mi", "local-favorite"],
  },
  {
    id: "2",
    name: "Cơm Tấm Sài Gòn",
    cuisine: "Vietnamese",
    rating: 4.6,
    reviewCount: 890,
    priceRange: "50,000 - 100,000 VND",
    coordinates: { lat: 21.0245, lng: 105.8412 },
    distance: "0.8 km",
    isHiddenGem: true,
    mood: ["comfort", "traditional"],
    tags: ["com-tam", "grilled-pork", "authentic"],
  },
];

const mockChallenges = [
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
  },
];

// Mock user database
const mockUsers = [
  {
    id: "1",
    email: "user@mumii.com",
    password: "$2a$12$8yNvEHOplIkNUQQD.Zy5WOTqJGD9Zd6aW0Y4EyMkE8vEsSpKGl4Uy", // password123
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    favorites: [],
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "foodie@mumii.com",
    password: "$2a$12$8yNvEHOplIkNUQQD.Zy5WOTqJGD9Zd6aW0Y4EyMkE8vEsSpKGl4Uy", // password123
    name: "Jane Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    favorites: ["1", "3"],
    createdAt: "2024-01-02T00:00:00Z",
  },
];

// Routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API service is running",
    timestamp: new Date().toISOString(),
  });
});

// Restaurants endpoints
app.get("/api/restaurants", (req, res) => {
  const { mood, cuisine, radius, lat, lng } = req.query;

  let filteredRestaurants = [...mockRestaurants];

  // Filter by mood
  if (mood && mood !== "all") {
    filteredRestaurants = filteredRestaurants.filter((r) =>
      r.mood.includes(mood as string)
    );
  }

  // Filter by cuisine
  if (cuisine) {
    filteredRestaurants = filteredRestaurants.filter((r) =>
      r.cuisine.toLowerCase().includes((cuisine as string).toLowerCase())
    );
  }

  // Filter by location radius (mock calculation)
  if (lat && lng && radius) {
    // In real implementation, calculate actual distance
    console.log(`Filtering by location: ${lat}, ${lng} within ${radius}m`);
  }

  res.json({
    restaurants: filteredRestaurants,
    total: filteredRestaurants.length,
  });
});

app.get("/api/restaurants/:id", (req, res) => {
  const { id } = req.params;
  const restaurant = mockRestaurants.find((r) => r.id === id);

  if (!restaurant) {
    return res.status(404).json({ error: "Restaurant not found" });
  }

  res.json(restaurant);
});

// Trip planner endpoint
app.post("/api/itinerary", (req, res) => {
  const {
    budget,
    location,
    cuisineType,
    groupSize,
    groupType,
    mood,
    duration,
  } = req.body;

  // Mock itinerary generation based on preferences
  const mockItinerary = {
    id: Date.now().toString(),
    preferences: req.body,
    recommendations: [
      {
        day: 1,
        restaurants: mockRestaurants.slice(0, 2),
        estimatedCost: budget * 0.8,
        theme: `${mood} dining experience`,
      },
    ],
    totalEstimatedCost: budget * 0.8 * duration,
    createdAt: new Date().toISOString(),
  };

  res.json(mockItinerary);
});

// Challenges endpoints
app.get("/api/challenges", (req, res) => {
  const { status } = req.query;

  let filteredChallenges = [...mockChallenges];

  if (status === "active") {
    filteredChallenges = filteredChallenges.filter(
      (c) => !c.isCompleted && c.progress > 0
    );
  } else if (status === "completed") {
    filteredChallenges = filteredChallenges.filter((c) => c.isCompleted);
  } else if (status === "available") {
    filteredChallenges = filteredChallenges.filter(
      (c) => !c.isCompleted && c.progress === 0
    );
  }

  res.json({
    challenges: filteredChallenges,
    total: filteredChallenges.length,
  });
});

app.post("/api/challenges/:id/join", (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  // Mock joining challenge
  res.json({
    success: true,
    message: `User ${userId} joined challenge ${id}`,
    challengeId: id,
  });
});

// Geofencing endpoint for nearby restaurants
app.post("/api/nearby", (req, res) => {
  const { latitude, longitude, radius = 1000 } = req.body;

  // Mock calculation - in real app, use spatial database queries
  const nearbyRestaurants = mockRestaurants.filter((restaurant) => {
    // Simple distance calculation (not accurate for production)
    const latDiff = Math.abs(restaurant.coordinates.lat - latitude);
    const lngDiff = Math.abs(restaurant.coordinates.lng - longitude);
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111000; // rough meters

    return distance <= radius;
  });

  res.json({
    restaurants: nearbyRestaurants,
    userLocation: { latitude, longitude },
    searchRadius: radius,
  });
});

// Push notification subscription endpoint
app.post("/api/notifications/subscribe", (req, res) => {
  const { subscription, userId } = req.body;

  // In real app, save subscription to database
  console.log("New push subscription:", subscription);

  res.json({
    success: true,
    message: "Subscription saved successfully",
  });
});

// Send push notification endpoint
app.post("/api/notifications/send", (req, res) => {
  const { userId, title, body, data } = req.body;

  // In real app, use Web Push library to send notifications
  console.log("Sending notification:", { userId, title, body, data });

  res.json({
    success: true,
    message: "Notification sent successfully",
  });
});

// Locales endpoint
app.get("/api/locales/:lang/:namespace", (req, res) => {
  const { lang, namespace } = req.params;

  // Mock locale data - in a real app, this would come from a database
  const localeData = {
    en: {
      common: {
        welcome: "Welcome to",
        appName: "Mumii",
        tagline: "Discover Hidden Culinary Gems",
        features: "Features",
      },
      navigation: {
        home: "Home",
        explore: "Explore",
        planner: "Trip Planner",
        challenges: "Challenges",
        map: "Map",
      },
    },
    vi: {
      common: {
        welcome: "Chào mừng đến với",
        appName: "Mumii",
        tagline: "Khám Phá Ẩm Thực Địa Phương",
        features: "Tính Năng",
      },
      navigation: {
        home: "Trang chủ",
        explore: "Khám phá",
        planner: "Lập kế hoạch",
        challenges: "Thử thách",
        map: "Bản đồ",
      },
    },
  };

  const data =
    localeData[lang as keyof typeof localeData]?.[
      namespace as keyof typeof localeData.en
    ];

  if (!data) {
    return res.status(404).json({ error: "Locale not found" });
  }

  res.json(data);
});

// Authentication endpoints
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if user already exists
  const existingUser = mockUsers.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: "User already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create new user
  const newUser = {
    id: String(mockUsers.length + 1),
    email,
    password: hashedPassword,
    name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    favorites: [],
    createdAt: new Date().toISOString(),
  };

  mockUsers.push(newUser);

  res.status(201).json({
    message: "User created successfully",
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      avatar: newUser.avatar,
    },
  });
});

app.post("/api/auth/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Find user
  const user = mockUsers.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET || "fallback-secret",
    { expiresIn: "7d" }
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      favorites: user.favorites,
    },
  });
});

// User profile endpoints
app.get("/api/user/profile", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header required" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as any;
    const user = mockUsers.find((u) => u.id === decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      favorites: user.favorites,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Favorites endpoints
app.post("/api/user/favorites", (req, res) => {
  const { restaurantId } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header required" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as any;
    const user = mockUsers.find((u) => u.id === decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.favorites.includes(restaurantId)) {
      user.favorites.push(restaurantId);
    }

    res.json({
      message: "Restaurant added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.delete("/api/user/favorites/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header required" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as any;
    const user = mockUsers.find((u) => u.id === decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.favorites = user.favorites.filter((id) => id !== restaurantId);

    res.json({
      message: "Restaurant removed from favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Social sharing endpoint
app.post("/api/social/share", (req, res) => {
  const { platform, content, url } = req.body;

  // Mock social sharing analytics
  console.log(`Shared on ${platform}:`, { content, url });

  res.json({
    success: true,
    message: `Content shared successfully on ${platform}`,
    shareUrl: url,
    platform,
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 API Service running on port ${PORT}`);
  console.log(
    `📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`
  );
  console.log(`🗺️  Available endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/restaurants`);
  console.log(`   POST /api/itinerary`);
  console.log(`   GET  /api/challenges`);
  console.log(`   POST /api/nearby`);
  console.log(`   POST /api/notifications/subscribe`);
});

export default app;
