const Supplement = require("../models/supplementModel");

// Add a new supplement
exports.addSupplement = async (req, res) => {
    try {
        const { userId, type, name, dosage, frequency, howToTake, startDate, endDate, reminderEnabled, reminderTime, date } = req.body;

        if (!userId || !name || !type) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const supplement = new Supplement({
            userId,
            type,
            name,
            dosage,
            frequency,
            howToTake,
            startDate,
            endDate,
            reminderEnabled,
            reminderTime,
            date,
        });

        const savedSupplement = await supplement.save();
        res.status(201).json(savedSupplement);
    } catch (error) {
        console.error("Error adding supplement:", error);
        res.status(500).json({ message: "Failed to add supplement" });
    }
};

// Get supplements for a user
exports.getSupplements = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ message: "UserId is required" });
        }

        const supplements = await Supplement.find({ userId });
        res.status(200).json(supplements);
    } catch (error) {
        console.error("Error fetching supplements:", error);
        res.status(500).json({ message: "Failed to fetch supplements" });
    }
};

// Update a supplement
exports.updateSupplement = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedSupplement = await Supplement.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedSupplement) {
            return res.status(404).json({ message: "Supplement not found" });
        }

        res.status(200).json(updatedSupplement);
    } catch (error) {
        console.error("Error updating supplement:", error);
        res.status(500).json({ message: "Failed to update supplement" });
    }
};

// Delete a supplement
exports.deleteSupplement = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSupplement = await Supplement.findByIdAndDelete(id);

        if (!deletedSupplement) {
            return res.status(404).json({ message: "Supplement not found" });
        }

        res.status(200).json({ message: "Supplement deleted successfully" });
    } catch (error) {
        console.error("Error deleting supplement:", error);
        res.status(500).json({ message: "Failed to delete supplement" });
    }
};
