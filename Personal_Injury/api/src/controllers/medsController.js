const Medication = require("../models/medsModel");
const MedsCategory = require("../models/medsCategoryModel");

// Add a new medication
// Add a new medication
exports.addMed = async (req, res) => {
  try {
    const {
      name, // Frontend sends 'name'
      medicationName, // Legacy support
      dosage,
      unit,
      repeat, // Frontend sends 'repeat'
      frequency, // Legacy support
      time, // Frontend sends 'time' (reminder)
      startDate,
      endDate, // Frontend sends 'endDate'
      expirationDate, // Legacy support
      mealTiming,
      instructions,
      notes, // Frontend might send this inside detailed object or separate
      userId, // Mapped or extracted
      // Legacy optional fields
      medicationCategory,
      prescriptionNum,
    } = req.body;

    // Map incoming fields to Schema
    // Default userId from req.body or auth middleware if available (assuming req.body for now as per legacy code)

    const newMed = new Medication({
      medicationName: name || medicationName,
      medicationCategory: medicationCategory || "General", // Default if missing
      prescriptionNum: prescriptionNum || "N/A",      // Default if missing
      dosage: Number(dosage),
      unit: unit,
      frequency: repeat || frequency,
      startDate: startDate,
      expirationDate: endDate || expirationDate || null,
      instructions: instructions,
      reminderTime: time,
      mealTiming: mealTiming,
      notes: notes,
      userId: userId || req.body.userId, // Ensure userId is passed
    });

    // Basic validation
    if (!newMed.medicationName || !newMed.dosage || !newMed.startDate || !newMed.userId) {
      return res.status(400).json({ message: "Missing required fields (Name, Dosage, StartDate, UserId)" });
    }

    console.log("Medication to save: ", newMed);
    const savedMed = await newMed.save();
    return res.status(201).json(savedMed);

  } catch (err) {
    console.error("Error saving medication:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update medication
// Update medication
exports.updateMed = async (req, res) => {
  try {
    const {
      medId,
      name, // New
      medicationName,
      medicationCategory,
      prescriptionNum,
      dosage,
      unit,
      repeat, // New
      frequency,
      time, // New (reminderTime)
      timeOfDayEnumOnceDaily,
      timeOfDayEnumTwiceOrThreeTimesDaily,
      intervalTime,
      startDate,
      endDate, // New
      expirationDate,
      mealTiming, // New
      instructions,
      notes,
    } = req.body;

    const dataToUpdate = {
      medicationName: name || medicationName,
      medicationCategory,
      prescriptionNum,
      dosage: dosage ? Number(dosage) : undefined,
      unit,
      frequency: repeat || frequency,
      timeOfDayEnumOnceDaily,
      timeOfDayEnumTwiceOrThreeTimesDaily,
      intervalTime,
      startDate,
      expirationDate: endDate || expirationDate,
      instructions,
      mealTiming,
      reminderTime: time,
      notes,
    };

    // Remove undefined keys to avoid overwritting with null/undefined if not sent
    Object.keys(dataToUpdate).forEach(key => dataToUpdate[key] === undefined && delete dataToUpdate[key]);

    console.log("Medication data to Update: ", dataToUpdate); // for debugging - to remove

    const updatedMed = await Medication.findByIdAndUpdate(medId, dataToUpdate, {
      new: true, // return the new updated document
      runValidators: true, // ensure the update is valid according to the schema
    });
    if (updatedMed) {
      return res.status(201).json(updatedMed);
    } else {
      return res
        .status(400)
        .json({ message: "Error updating Medication data" });
    }
  } catch (err) {
    console.error("Error updating medication:", err);
    res.status(500).json({ message: err.message });
  }
};

/* TODO: Implement admin/ manager -interface to add new category and medication(s)
        according to the business requirements
*/
// Add new medication(s) to the Category
exports.addMedsToCat = async (req, res) => {
  const { category, medications } = req.body;

  try {
    let medsCategory = await MedsCategory.findOne({ category });

    if (medsCategory) {
      // If category exists, update the medications list
      medsCategory.medications = [
        ...new Set([...medsCategory.medications, ...medications]),
      ];
    } else {
      // If category does now exist, create a new category
      medsCategory = new MedsCategory({
        category,
        medications,
      });
    }

    const savedMedCategory = await medsCategory.save();
    if (savedMedCategory) {
      return res.status(201).json(savedMedCategory);
    } else {
      return res
        .status(400)
        .json({ message: "Error saving Medication Category data" });
    }
  } catch (err) {
    console.error("Error saving medication category:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all medication categories
exports.getAllCategories = async (req, res) => {
  try {
    const cats = await MedsCategory.find();
    return res.status(200).json(cats);
  } catch (err) {
    console.error("Error getting categories:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all medications
exports.getAllMeds = async (req, res) => {
  try {
    const meds = await Medication.find();
    return res.status(200).json(meds);
  } catch (err) {
    console.error("Error getting medications:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all medication records of current date
exports.getAllMedsRecords = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;

    console.log("getAllMeds Records - userId: ", userId);

    // If no date is provided, return all medications for the user
    let query = { userId: userId };

    if (date) {
      const formattedDate = new Date(date);
      console.log("getAllMeds Records - date: ", formattedDate);

      // Filter medications that are active on the specified date
      query.startDate = { $lte: formattedDate };
      query.$or = [
        { expirationDate: { $gte: formattedDate } },
        { expirationDate: null },
        { expirationDate: { $exists: false } }
      ];
    }

    const records = await Medication.find(query).sort({ startDate: -1 });

    console.log("getAllMeds Load result: ", records);
    return res.status(200).json({ success: true, data: records });
  } catch (err) {
    console.error("Error getting medication records:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete a medication
exports.deleteMed = async (req, res) => {
  try {
    const { medId } = req.params;
    console.log("Deleting medication with ID:", medId);

    const deletedMed = await Medication.findByIdAndDelete(medId);

    if (deletedMed) {
      return res.status(200).json({ message: "Medication deleted successfully", id: medId });
    } else {
      return res.status(404).json({ message: "Medication not found" });
    }
  } catch (err) {
    console.error("Error deleting medication:", err);
    res.status(500).json({ message: err.message });
  }
};
