const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const moodController = require("../controllers/moodController");

// Check if a mood exists for today (Protected)
router.get("/check-today", authenticateToken, moodController.checkTodayMood);

// Adding a new mood entry (Protected)
router.post("/add", authenticateToken, moodController.addMood);

// Get all moods for a user (Protected)
router.get("/user/:userId", authenticateToken, moodController.getMoodsByUser);

// Delete a mood entry (Protected)
router.delete("/:id", authenticateToken, moodController.deleteMood);

module.exports = router;
