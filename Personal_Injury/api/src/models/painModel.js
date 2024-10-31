const mongoose = require("mongoose");

const painSchema = new mongoose.Schema(
  {
    painName: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateTime: {
      type: Date,
      // Validation to not access future dates
      validator: function (value) {
        return value <= new Date();
      },
      message: "Future dates unaccessible",
    },
    painScale: {
      type: String,
      default: "0",
      enum: ["0", "1", "2", "3", "4", "5"],
    },
    painLocation: {
      type: String,
      default: "",
      enum: [
        "",
        "head",
        "neck",
        "back",
        "shoulder",
        "upperLimb",
        "lowerLimb",
        "chest",
        "abdomen",
        "hip",
      ],
    },
    detailedLocation: {
      type: String,
      default: "",
      enum: [
        "",
        "leftShoulder",
        "rightShoulder",
        "leftUpperArm",
        "rightUpperArm",
        "leftForeArm",
        "rightForeArm",
        "leftElbow",
        "rightElbow",
        "leftWrist",
        "rightWrist",
        "leftKnee",
        "rightKnee",
        "leftAnkle",
        "rightAnkle",
        "leftFoot",
        "rightFoot",
        "upperBack",
        "middleBack",
        "lowerBack",
      ],
    },
    painDuration: {
      type: String,
      default: "",
      enum: [
        "",
        "Less than 1 hour",
        "1-2 hours",
        "2-4 hours",
        "4-6 hours",
        "More than 6 hours",
      ],
    },
    painType: {
      type: String,
      default: "",
      enum: ["", "sharp", "dull", "stinging", "aching", "burning"],
    },
    // TODO: Research and add more possible symptoms
    symptoms: {
      type: [String],
      default: [],
      enum: ["headache", "dizziness", "nausea", "fatigue", "muscle_weakness"],
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    startDateTime: {
      type: Date,
      required: true,
    },
    // TODO: Implement Audio Recordings
    recordedURI: {
      type: String,
    },
  },
  { timestamps: true }
);

// Validate that createdAt field cannot be updated
painSchema.path("createdAt").immutable(true);

const PainLog = mongoose.model("Pain", painSchema);

module.exports = PainLog;
