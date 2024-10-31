const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exerciseController");

// Adding a new exercise entry
router.post("/", exerciseController.addExercise);

// Getting all exercise entries
router.get("/", exerciseController.getExercises);

module.exports = router;
