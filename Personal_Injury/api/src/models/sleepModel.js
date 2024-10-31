const mongoose = require("mongoose");

const sleepSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    sleepHours: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value >= 0 && value <= 24;
        },
        message: "Sleep hours must be between 0 and 24",
      },
    },
    mood: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    factors: [
      {
        type: String,
        enum: [
          "Stress",
          "Caffeine",
          "Noise",
          "Exercise",
          "Alcohol",
          "Late meal",
          "Screen time",
          "Room temperature",
          "Bed comfort",
          "Partner disturbance",
          "Kids disturbance",
          "Pet disturbance",
          "Pain",
          "Medication",
          "Travel",
          "Work",
          "Anxiety",
          "Depression",
          "Allergies",
          "Illness",
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

sleepSchema.path("createdAt").immutable(true);

const sleepLog = mongoose.model("Sleep", sleepSchema);

module.exports = sleepLog;
