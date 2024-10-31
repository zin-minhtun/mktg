const express = require("express");
const router = express.Router();
const moodController = require("../controllers/moodController");

// Adding a new mood entry
router.post("/add", moodController.addMood);

// // Getting all mood entries
// router.get("/", moodController.getMoods);

// // Delete a mood entry
// router.delete("/:id", moodController.deleteMood);

module.exports = router;
