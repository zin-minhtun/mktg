const mongoose = require("mongoose");

const painSchema = new mongoose.Schema(
  {
    painName: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    intensity: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    painLocation: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "At least one pain location must be selected"
      }
    },
    painType: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "At least one pain type must be selected"
      }
    },
    reliefFactors: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    triggers: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    limitations: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    worseningActivities: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    improvingActivities: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    painDistribution: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    painPattern: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    additionalNotes: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true
  }
);

painSchema.index({ userId: 1, createdAt: -1 });
painSchema.path("createdAt").immutable(true);

const PainLog = mongoose.model("Pains", painSchema, "pains");

module.exports = PainLog;