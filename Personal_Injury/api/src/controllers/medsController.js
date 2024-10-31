const Medication = require("../models/medsModel");
const MedsCategory = require("../models/medsCategoryModel");

// Add a new medication
exports.addMed = async (req, res) => {
  // TODO: Add Camera Image
  const {
    medicationName,
    medicationCategory,
    prescriptionNum,
    dosage,
    unit,
    frequency,
    timeOfDayEnumOnceDaily,
    timeOfDayEnumTwiceOrThreeTimesDaily,
    intervalTime,
    startDate,
    expirationDate,
    instructions,
    notes,
    userId,
  } = req.body;

  // Backend validation
  if (
    !medicationName ||
    !medicationCategory ||
    !prescriptionNum ||
    !dosage ||
    !unit ||
    !frequency ||
    !startDate ||
    !expirationDate ||
    !instructions ||
    !userId
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  try {
    const newMed = new Medication({
      medicationName,
      medicationCategory,
      prescriptionNum,
      dosage,
      unit,
      frequency,
      timeOfDayEnumOnceDaily,
      timeOfDayEnumTwiceOrThreeTimesDaily,
      intervalTime,
      startDate,
      expirationDate,
      instructions,
      notes,
      userId,
    });
    console.log("Medication to save: ", newMed);
    const savedMed = await newMed.save();
    if (savedMed) {
      return res.status(201).json(savedMed);
    } else {
      return res
        .status(400)
        .json({ message: "Error creating Medication data" });
    }
  } catch (err) {
    console.error("Error saving medication:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update medication
exports.updateMed = async (req, res) => {
  try {
    const {
      medId,
      medicationName,
      medicationCategory,
      prescriptionNum,
      dosage,
      unit,
      frequency,
      timeOfDayEnumOnceDaily,
      timeOfDayEnumTwiceOrThreeTimesDaily,
      intervalTime,
      startDate,
      expirationDate,
      instructions,
      notes,
    } = req.body;

    const dataToUpdate = {
      medicationName,
      medicationCategory,
      prescriptionNum,
      dosage,
      unit,
      frequency,
      timeOfDayEnumOnceDaily,
      timeOfDayEnumTwiceOrThreeTimesDaily,
      intervalTime,
      startDate,
      expirationDate,
      instructions,
      notes,
    };
    console.log("Medication data to Update: ", dataToUpdate); // for debugging - to remove

    const updatedMed = await Medication.findByIdAndUpdate(medId, dataToUpdate, {
      new: true, // return the new updated document
      runValidatiors: true, // ensure the update is valid according to the schema
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

    const formattedDate = new Date(date);

    console.log("getAllMeds Records - userId: ", userId); // for debugging - to remove
    console.log("getAllMeds Records - date: ", formattedDate); // for debugging - to remove

    const records = await Medication.find({
      userId: userId,
      startDate: { $lte: formattedDate },
      expirationDate: { $gte: formattedDate },
    });

    console.log("getAllMeds Load result: ", records); // for debugging - to remove
    return res.status(200).json(records);
  } catch (err) {
    console.error("Error getting medication records:", err);
    res.status(500).json({ message: err.message });
  }
};
