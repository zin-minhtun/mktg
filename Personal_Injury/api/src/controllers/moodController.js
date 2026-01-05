const MoodLog = require("../models/moodModel");
const User = require("../models/userModel");

// Check if a mood exists for today
exports.checkTodayMood = async (req, res) => {
  const { userId, date } = req.query;

  if (!userId || !date) {
    return res.status(400).json({ message: "Missing userId or date" });
  }

  try {
    const moodEntry = await MoodLog.findOne({
      userId,
      date: date, // Assuming date is passed as "YYYY-MM-DD" matching the stored format
    });

    if (moodEntry) {
      return res.status(200).json({ logged: true, mood: moodEntry });
    } else {
      return res.status(200).json({ logged: false });
    }
  } catch (err) {
    console.error("Error checking mood:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all moods for a user
exports.getMoodsByUser = async (req, res) => {
  try {
    const moods = await MoodLog.find({ userId: req.params.userId }).sort({ date: -1, createdAt: -1 });
    res.status(200).json(moods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a mood entry
exports.deleteMood = async (req, res) => {
  try {
    const mood = await MoodLog.findById(req.params.id);
    if (!mood) {
      return res.status(404).json({ message: "Mood entry not found" });
    }
    await MoodLog.findByIdAndDelete(req.params.id);
    res.json({ message: "Mood entry deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
