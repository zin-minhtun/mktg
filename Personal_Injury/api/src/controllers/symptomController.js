const Symptom = require('../models/symptomModel');

// [POST] Create a new log
exports.addSymptomLog = async (req, res) => {
  try {
    const newLog = new Symptom(req.body);
    const savedLog = await newLog.save();
    res.status(201).json({ success: true, data: savedLog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// [GET] Retrieve logs for a specific user
exports.getSymptomHistory = async (req, res) => {
  try {
    const logs = await Symptom.find({ userId: req.params.userId }).sort({ date: -1 });
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// [PUT] Update an existing log by ID
exports.updateSymptomLog = async (req, res) => {
  try {
    const updatedLog = await Symptom.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedLog) return res.status(404).json({ message: "Log not found" });
    res.status(200).json({ success: true, data: updatedLog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// [DELETE] Remove a log by ID
exports.deleteSymptomLog = async (req, res) => {
  try {
    const deletedLog = await Symptom.findByIdAndDelete(req.params.id);
    if (!deletedLog) return res.status(404).json({ message: "Log not found" });
    res.status(200).json({ success: true, message: "Log deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};