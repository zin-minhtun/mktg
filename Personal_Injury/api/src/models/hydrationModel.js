const mongoose = require('mongoose');

const hydrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
    // time: { // not sure if time is needed
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
);

hydrationSchema.path('createdAt').immutable(true);

const Hydration = mongoose.model('Hydration', hydrationSchema);

module.exports = Hydration;
