const SocialActivity = require('../models/socialActivityModel');

// Add a new social activity log entry
exports.addSocialActivity = async (req, res) => {
  const { userId, stimulation, activities, duration, date, notes } = req.body;

  if (!userId || !stimulation || !activities || !date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const socialActivityEntry = new SocialActivity({
      userId,
      stimulation,
      activities, // Array of strings
      duration: duration || 0,
      date,
      notes,
    });

    console.log('Social activity entry to save: ', socialActivityEntry); // for debugging - to remove
    const newSocialActivity = await socialActivityEntry.save();
    if (newSocialActivity) {
      return res.status(201).json(newSocialActivity);
    } else {
      return res.status(400).json({ message: 'Error creating social activity entry' });
    }
  } catch (err) {
    console.error('Error saving social activity entry:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all social activity entries
exports.getSocialActivities = async (req, res) => {
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
    const socialActivities = await SocialActivity.find(query).sort({ createdAt: -1 });
    res.json(socialActivities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSocialActivity = async (req, res) => {
  try {
    const { id } = req.params;
    await SocialActivity.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete" });
  }
};

exports.updateSocialActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await SocialActivity.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update" });
  }
};
