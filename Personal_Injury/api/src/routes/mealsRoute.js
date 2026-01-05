const express = require('express');
const router = express.Router();
const mealsController = require('../controllers/mealsController');

// Define RESTful routes for meals
router.post('/', mealsController.addMeal);
router.get('/', mealsController.getMealsByDate);
router.put('/:mealId', mealsController.updateMeal);
router.delete('/:mealId', mealsController.deleteMeal);

module.exports = router;