const mongoose = require("mongoose");

// selectedOption(more or less), selectedSleepType (un-distrurbed), checkedItems

const sleepSchema = new mongoose.Schema(
  {
    sleepHours: {
      type: String,
      required: true,
    },
    sleepType: {
      type: String,
      enum: ["more", "less"],
      required: true,
    },
    sleepQuality: {
      type: String,
      enum: ["disrupted", "undisrupted"],
      required: true,
    },
    sleepNotes: {
      type: String,
      default: "",
    },
    factors: [
      {
        type: String,
        enum: [
          "usedSleepingAids",
          "wokeUpInPain",
          "hardTimeFallingAsleep",
          "wokeUpInMiddleOfNight",
          "tossedAndTurnedDuringNight",
          "wokeUpScared",
          "hadNightmares",
          "hadToUseWashroom",
        ],
      },
    ],
  }
);

module.exports = sleepSchema;

//sleepSchema.path("createdAt").immutable(true);
//const sleepLog = mongoose.model("Sleep", sleepSchema);
//module.exports = sleepLog;
