// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("redis");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

// Initialize HTTP server and Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"],
  },
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Helper function to get leaderboard
app.get("/api/leaderboard", async (req, res) => {
  try {
    // Assuming user scores are stored as sorted set with key 'leaderboard'
    const leaderboard = await redisClient.zRangeWithScores(
      "leaderboard",
      0,
      -1,
      { REV: true }
    );
    res.json(
      leaderboard.map((user) => ({ username: user.value, score: user.score }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Helper function to update leaderboard
const updateLeaderboard = async (username) => {
  try {
    await redisClient.zIncrBy("leaderboard", 1, username);
    const leaderboard = await redisClient.zRangeWithScores(
      "leaderboard",
      0,
      -1,
      { REV: true }
    );
    io.emit(
      "leaderboardUpdate",
      leaderboard.map((user) => ({ username: user.value, score: user.score }))
    );
  } catch (error) {
    console.error(error);
  }
};

// User login or registration
app.post("/api/login", async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }
  try {
    // Initialize user score if not exists
    const exists = await redisClient.zScore("leaderboard", username);
    if (exists === null) {
      await redisClient.zAdd("leaderboard", { score: 0, value: username });
    }
    res.json({ message: "Login successful", username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update user's score when a game is won
app.post("/api/win", async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }
  try {
    await updateLeaderboard(username);
    res.json({ message: "Score updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Save and retrieve game state for a user
app.post("/api/save-game", async (req, res) => {
  const { username, gameState } = req.body;
  if (!username || !gameState) {
    return res
      .status(400)
      .json({ message: "Username and gameState are required" });
  }
  try {
    await redisClient.set(`game:${username}`, JSON.stringify(gameState));
    res.json({ message: "Game state saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/load-game/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const gameState = await redisClient.get(`game:${username}`);
    if (gameState) {
      res.json(JSON.parse(gameState));
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
