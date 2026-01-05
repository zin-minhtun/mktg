const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema(
  {
    medicationName: {
      type: String,
      required: true,
    },
    medicationCategory: {
      type: String,
      // required: true, // Made optional for flexibility
    },
    prescriptionNum: {
      type: String,
      // required: true, // Made optional
    },
    dosage: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      // Removed strict enum to allow flexible units
      required: true,
    },
    frequency: {
      type: String,
      // Removed strict enum
      required: true,
    },
    // Retain old fields for backward compatibility but make optional
    timeOfDayEnumOnceDaily: {
      type: String,
    },
    timeOfDayEnumTwiceOrThreeTimesDaily: {
      type: String,
    },
    intervalTime: {
      type: Number,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expirationDate: {
      type: Date,
      // required: true, // Made optional
    },
    instructions: {
      type: mongoose.Schema.Types.Mixed, // Can be String or Array now
      // required: true, 
    },
    reminderTime: {
      type: String, // e.g. "08:00"
    },
    mealTiming: {
      type: String, // e.g. "With Food"
    },
    notes: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

medicationSchema.path("createdAt").immutable(true);

const Medication = mongoose.model("Medication", medicationSchema);

module.exports = Medication;
