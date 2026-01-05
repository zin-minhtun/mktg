const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exerciseController");

// Adding a new exercise entry
router.post("/", exerciseController.addExercise);

// Getting all exercise entries
router.get("/", exerciseController.getExercises);

router.delete("/delete/:id", exerciseController.deleteExercise);
router.put("/update/:id", exerciseController.updateExercise);

module.exports = router;
