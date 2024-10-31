const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema(
  {
    medicationName: {
      type: String,
      required: true,
    },
    medicationCategory: {
      type: String,
      required: true,
    },
    prescriptionNum: {
      type: String,
      required: true,
    },
    dosage: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: [
        "Milligrams_mg",
        "Micrograms_mcg_or_ug",
        "Milliliters_ml",
        "International_Units_IU",
        "Grams_g",
        "Tablets_tab",
        "Teaspoons_tsp",
        "Drops_gtt",
      ],
      required: true,
    },
    frequency: {
      type: String,
      enum: [
        "Once_daily",
        "Twice_daily",
        "Three_times_daily",
        "Interval",
        "As_Needed_PRN",
      ],
      required: true,
    },
    timeOfDayEnumOnceDaily: {
      type: String,
      enum: ["Every_Morning_QAM", "Every_Evening_QPM", "Once_Daily_OD"],
      // required: true,
    },
    timeOfDayEnumTwiceOrThreeTimesDaily: {
      type: String,
      enum: ["Before_Meal_30min_or_1H", "After_Meal_30min_or_1H"],
      // required: true,
    },
    intervalTime: {
      type: Number,
      // required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    instructions: {
      type: String,
      enum: ["Oral", "Injection", "Topical", "Inhaled"],
      required: true,
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
