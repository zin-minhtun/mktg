const SleepLog = require("../models/sleepModel");

/*******Notes*******/
// FIXME: FIX factor to be not null

const addSleep = async (req, res) => {
  try {
    const { userId, date, sleepHours, mood, notes, factors } = req.body;

    // Check if required fields are missing
    if (!userId || !date || !sleepHours || !mood) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sleepEntry = new SleepLog({
      userId,
      date,
      sleepHours,
      mood,
      notes,
      factors: factors.map((factor) => factor.label),
    });

    // Validate the sleep entry
    await sleepEntry.validate();

    const savedSleepEntry = await sleepEntry.save();

    res.status(201).json(savedSleepEntry);
  } catch (error) {
    console.error("Error adding sleep entry:", error);
    res.status(500).json({ error: "Failed to add sleep entry" });
  }
};

module.exports = { addSleep };
