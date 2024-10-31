const mongoose = require('mongoose');

const bodyCompositionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: false,
    },
    neck: {
      type: Number,
      required: false,
    },
    waist: {
      type: Number,
      required: false,
    },
    hips: {
      type: Number,
      required: false,
    },
    bodyFatPercentage: {
      type: Number,
      required: false,
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

bodyCompositionSchema.path('createdAt').immutable(true);

const BodyComposition = mongoose.model(
  'BodyComposition',
  bodyCompositionSchema
);

module.exports = BodyComposition;
