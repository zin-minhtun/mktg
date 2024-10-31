const Adl = require("../models/adlModel");

const addAdls = async (req, res) => {
  try {
    const { userId, categories, itemLabels, notes, date } = req.body;

    const adlEntry = new Adl({
      userId,
      categories,
      itemLabels,
      notes,
      date,
    });

    await adlEntry.save();

    res.status(201).json({ message: "ADL added successfully", adlEntry });
  } catch (error) {
    console.error("Error adding ADL:", error);
    res.status(500).json({ message: "Failed to add ADL" });
  }
};

module.exports = { addAdls };
