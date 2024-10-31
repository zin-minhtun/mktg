const Exercise = require("../models/exerciseModel");

// Add a new exercise log entry
exports.addExercise = async (req, res) => {
  const { userId, intensity, exercise, duration, date, notes } = req.body;

  if (!userId || !intensity || !exercise || !duration || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const exerciseEntry = new Exercise({
      userId,
      intensity,
      exercise,
      duration,
      date,
      notes,
    });

    console.log("Exercise entry to save: ", exerciseEntry); // for debugging - to remove
    const newExercise = await exerciseEntry.save();
    if (newExercise) {
      return res.status(201).json(newExercise);
    } else {
      return res.status(400).json({ message: "Error creating exercise entry" });
    }
  } catch (err) {
    console.error("Error saving exercise entry:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all exercise entries
exports.getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
