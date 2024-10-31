const MoodLog = require("../models/moodModel");
const User = require("../models/userModel");

// Add a new mood entry
exports.addMood = async (req, res) => {
  const { date, mood, moodScale, notes, timeOfDay, userId } = req.body;

  // Check if required fields are missing
  if (!date || !mood || !moodScale || !timeOfDay || !userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Validate userId
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for userId:", userId); // For Debugging - to remove
      return res.status(400).json({ message: "Invalid userId" });
    }

    const moodEntry = new MoodLog({
      userId,
      date,
      mood,
      moodScale,
      notes,
      timeOfDay,
    });

    console.log("MoodEntry to save : ", moodEntry); // For Debugging - to remove

    const newMood = await moodEntry.save();
    if (newMood) {
      console.log("New mood entry saved successfully:", newMood); // For Debugging - to remove
      return res.status(201).json(newMood);
    } else {
      console.log("Error saving mood entry"); // For Debugging - to remove
      return res.status(400).json({ message: "Error creating Mood data" });
    }
  } catch (err) {
    console.error("Error saving mood entry:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get a mood entry
// exports.getMoods = async (req, res) => {
//   try {
//     const moods = await Mood.find();
//     res.json(moods);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Delete a mood entry
// exports.deleteMood = async (req, res) => {
//   try {
//     const mood = await Mood.findById(req.params.id);
//     if (mood == null) {
//       return res.status(404).json({ message: "Mood entry not found" });
//     }

//     await mood.remove();
//     res.json({ message: "Mood entry deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
