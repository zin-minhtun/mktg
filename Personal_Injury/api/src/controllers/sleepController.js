const SleepLog = require("../models/sleepModel");

const addSleep = async (req, res) => {
  try {
    const { userId, date, sleepHours, sleepType, sleepQuality, sleepNotes, factors } = req.body;

    // Check if required fields are missing
    if (!userId || !date || !sleepHours || !sleepType || !sleepQuality) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sleepEntry = new SleepLog({
      userId,
      date,
      sleepHours,
      sleepType,
      sleepQuality,
      sleepNotes,
      factors
    });

    const savedSleepEntry = await sleepEntry.save();

    res.status(201).json(savedSleepEntry);
  } catch (error) {
    console.error("Error adding sleep entry:", error);
    res.status(500).json({ error: "Failed to add sleep entry" });
  }
};

module.exports = { addSleep };
