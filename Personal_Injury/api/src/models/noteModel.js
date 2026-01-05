const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["general", "pain", "mood", "exercise", "other"],
      default: "general",
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { 
    timestamps: true 
  }
);

// Index for efficient querying
noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.path("createdAt").immutable(true);

const Note = mongoose.model("Notes", noteSchema, "notes");

module.exports = Note;