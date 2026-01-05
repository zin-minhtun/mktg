const Meal = require('../models/mealsModel');

// Create a new meal entry
exports.addMeal = async (req, res) => {
  try {
    const { userId, date, mealType, foodName, foodType, servingDetails, notes } = req.body;

    // Validate required fields
    if (!userId || !date || !mealType || !foodName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create new meal entry
    const mealEntry = new Meal({
      userId,
      date,
      mealType,
      foodName,
      foodType,
      servingDetails,
      notes
    });

    // Save to database
    const savedMeal = await mealEntry.save();
    res.status(201).json(savedMeal);
  } catch (error) {
    logErrorAndRespond(error, res, 'Error saving meal entry');
  }
};

// Get meal entries for a specific date
exports.getMealsByDate = async (req, res) => {
  try {
    const { userId, date } = req.query;

    // Validate required parameters
    if (!userId || !date) {
      return res.status(400).json({ message: 'User ID and date are required' });
    }

    const dateRange = getDateRange(date);
    const meals = await Meal.find({
      userId,
      date: { $gte: dateRange.startDate, $lte: dateRange.endDate }
    });

    res.status(200).json(meals);
  } catch (error) {
    logErrorAndRespond(error, res, 'Error fetching meals');
  }
};

// Update an existing meal entry
exports.updateMeal = async (req, res) => {
  try {
    const { mealId } = req.params;
    const updateData = req.body;

    const updatedMeal = await Meal.findByIdAndUpdate(
      mealId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedMeal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    res.status(200).json(updatedMeal);
  } catch (error) {
    logErrorAndRespond(error, res, 'Error updating meal');
  }
};

// Delete a meal entry
exports.deleteMeal = async (req, res) => {
  try {
    const { mealId } = req.params;

    const deletedMeal = await Meal.findByIdAndDelete(mealId);

    if (!deletedMeal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    res.status(200).json({ message: 'Meal deleted successfully' });
  } catch (error) {
    logErrorAndRespond(error, res, 'Error deleting meal');
  }
};

// Helper function to get date range for a given date
function getDateRange(date) {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  
  return { startDate, endDate };
}

// Helper function for consistent error handling
function logErrorAndRespond(error, res, message) {
  console.error(`${message}:`, error);
  res.status(500).json({ message: error.message });
}