const SocialActivity = require('../models/socialActivityModel');

// Add a new social activity log entry
exports.addSocialActivity = async (req, res) => {
  const { userId, stimulation, activity, duration, date, notes } = req.body;

  if (!userId || !stimulation || !activity || !duration || !date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const socialActivityEntry = new SocialActivity({
      userId,
      stimulation,
      activity,
      duration,
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
    const socialActivities = await SocialActivity.find();
    res.json(socialActivities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
