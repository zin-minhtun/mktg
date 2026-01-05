const mongoose = require("mongoose");

const sleepSchema = require("./sleepModel");
const mobilitySchema = require("./mobilityModel");

const dailyLogSchema = new mongoose.Schema(
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
    sleep: [sleepSchema], // the array allows multiple sleep logs per day
    mobility: [mobilitySchema], // the array allows multiple mobility logs per day
    water: {
      goalMl: { type: Number, default: 2000 },
      consumedMl: { type: Number, default: 0 },
      unit: { type: String, default: "oz" },
    },
  },
  {
    timestamps: true,
  }
);

dailyLogSchema.path("createdAt").immutable(true);

const DailyLog = mongoose.model("DailyLog", dailyLogSchema);

module.exports = DailyLog;
