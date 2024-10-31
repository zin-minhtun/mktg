const PainLog = require("../models/painModel");

const addPain = async (req, res) => {
  try {
    const {
      painName,
      userId,
      date,
      time,
      painScale,
      painLocation,
      detailedLocation,
      painDuration,
      painType,
      symptoms,
      notes,
      startDateTime,
    } = req.body;

    // Check if required fields are missing
    if (
      !painName ||
      !userId ||
      !date ||
      !time ||
      !painScale ||
      !painLocation ||
      !painDuration ||
      !painType ||
      !startDateTime
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate userId
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for userId:", userId); // For Debugging - to remove
      return res.status(400).json({ message: "Invalid userId" });
    }

    const painEntry = new PainLog({
      painName,
      userId,
      date,
      time,
      painScale,
      painLocation,
      detailedLocation,
      painDuration,
      painType,
      symptoms,
      notes,
      startDateTime,
    });

    // Save the new pain log
    const savedPainLog = await painEntry.save();

    res.status(201).json(savedPainLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add pain log" });
  }
};

module.exports = { addPain };
