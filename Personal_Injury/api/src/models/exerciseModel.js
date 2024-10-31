const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    intensity: {
      type: String,
      required: true,
    },
    exercise: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // Duration in minutes
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

exerciseSchema.path('createdAt').immutable(true);

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
