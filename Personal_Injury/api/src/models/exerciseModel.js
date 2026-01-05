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
    exercises: [
      {
        type: String,
      },
    ],
    duration: {
      type: Number, // Duration in minutes
      required: false,
      default: 0,
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
