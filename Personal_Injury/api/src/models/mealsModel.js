const mongoose = require('mongoose');

// Define valid meal types for better validation
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Others', 'Drinks'];

const mealSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    mealType: {
      type: String,
      required: true,
      enum: MEAL_TYPES,
    },
    foodName: {
      type: String,
      required: true,
    },
    foodType: {
      type: String,
    },
    servingDetails: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prevent modification of creation timestamp
mealSchema.path('createdAt').immutable(true);

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;