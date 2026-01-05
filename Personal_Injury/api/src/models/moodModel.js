const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      // Validation to not access future dates
      validator: function (value) {
        return value <= new Date();
      },
      message: "Future dates unaccessible",
    },

    mood: {
      type: String,
      required: true,
    },
    moodScale: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    timeOfDay: {
      type: String,
      required: true,
      enum: ["am", "pm", "night"],
    },
  },
  {
    timestamps: true,
  }
);

// Validate that createdAt field cannot be updated
moodSchema.path("createdAt").immutable(true);

const Mood = mongoose.model("Mood", moodSchema);

module.exports = Mood;
