const express = require('express');
const router = express.Router();
const symptomController = require('../controllers/symptomController');

// CRUD Endpoints
router.post('/add', symptomController.addSymptomLog);             // Create
router.get('/user/:userId', symptomController.getSymptomHistory); // Read
router.put('/:id', symptomController.updateSymptomLog);           // Update
router.delete('/:id', symptomController.deleteSymptomLog);        // Delete

module.exports = router;