const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    personalCare: {
      type: [String],
      enum: ['Bathing', 'Brushing Teeth', 'Grooming', 'Dressing', 'Eating'],
      required: false,
    },
    mobility: {
      type: [String],
      enum: ['Transferring', 'Walking', 'Transportation'],
      required: false,
    },
    householdTasks: {
      type: [String],
      enum: [
        'Cleaning',
        'Laundry',
        'Dish Washing',
        'Trash',
        'Cooking',
        'Food Storage',
      ],
      required: false,
    },
    lifeTasks: {
      type: [String],
      enum: [
        'Finances',
        'Communication',
        'Medication',
        'Technology',
        'Shopping',
      ],
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

activitySchema.path('createdAt').immutable(true);

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
