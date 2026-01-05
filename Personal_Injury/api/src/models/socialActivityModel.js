const mongoose = require('mongoose');

const socialActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stimulation: {
      type: String,
      required: true,
    },
    activities: {
      type: [String],
      required: true,
    },
    duration: {
      type: Number, // Duration in minutes
      required: false,
      default: 0
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

socialActivitySchema.path('createdAt').immutable(true);

const SocialActivity = mongoose.model('SocialActivity', socialActivitySchema);

module.exports = SocialActivity;
