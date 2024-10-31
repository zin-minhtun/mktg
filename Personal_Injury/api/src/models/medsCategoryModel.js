const mongoose = require("mongoose");

const medicationCatetorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      require: true,
    },
    medications: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const MedicationCategory = mongoose.model(
  "MedicationCategory",
  medicationCatetorySchema
);

module.exports = MedicationCategory;
