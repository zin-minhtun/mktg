const BodyComposition = require("../models/bodyCompositionModel");

// Add a new body composition entry
exports.addBodyComposition = async (req, res) => {
  const { userId, weight, height, neck, waist, hips, bodyFatPercentage, date, notes } = req.body;

  if (!userId || !weight || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const bodyCompositionEntry = new BodyComposition({
      userId,
      weight,
      height,
      neck,
      waist,
      hips,
      bodyFatPercentage,
      date,
      notes,
    });

    console.log("BodyCompositionEntry to save : ", bodyCompositionEntry); // for debugging - to remove
    const newBodyComposition = await bodyCompositionEntry.save();
    if (newBodyComposition) {
      return res.status(201).json(newBodyComposition);
    } else {
      return res.status(400).json({ message: "Error creating Body Composition data" });
    }
  } catch (err) {
    console.error("Error saving body composition entry:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all body composition entries
exports.getBodyCompositions = async (req, res) => {
  try {
    const bodyCompositions = await BodyComposition.find();
    res.json(bodyCompositions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
