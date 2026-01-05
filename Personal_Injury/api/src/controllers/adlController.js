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

const getAdls = async (req, res) => {
  try {
    const { userId, date } = req.query;
    // Filter by date if provided (assuming YYYY-MM-DD or full ISO)
    // For simplicity, finding match by day range if string provided
    let query = { userId };
    if (date) {
      // Assume date string like 2023-10-27
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }
    const adls = await Adl.find(query).sort({ createdAt: -1 });
    res.json(adls);
  } catch (error) {
    console.error("Error fetching ADLs:", error);
    res.status(500).json({ message: "Failed to fetch ADLs" });
  }
};

const deleteAdl = async (req, res) => {
  try {
    const { id } = req.params;
    await Adl.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete" });
  }
};

const updateAdl = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Adl.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update" });
  }
};

module.exports = { addAdls, getAdls, deleteAdl, updateAdl };
