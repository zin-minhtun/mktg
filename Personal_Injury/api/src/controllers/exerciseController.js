const Exercise = require("../models/exerciseModel");

// Add a new exercise log entry
exports.addExercise = async (req, res) => {
  const { userId, intensity, exercises, duration, date, notes } = req.body;

  if (!userId || !intensity || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const exerciseEntry = new Exercise({
      userId,
      intensity,
      exercises,
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
    const { userId, date } = req.query;
    let query = { userId };
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }
    const exercises = await Exercise.find(query).sort({ createdAt: -1 });
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;
    await Exercise.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete" });
  }
};

exports.updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Exercise.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update" });
  }
};
