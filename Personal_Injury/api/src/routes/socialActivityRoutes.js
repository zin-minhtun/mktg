const express = require('express');
const router = express.Router();
const socialActivityController = require('../controllers/socialActivityController');

// Adding a new social activity entry
router.post('/', socialActivityController.addSocialActivity);

// Getting all social activity entries
router.get('/', socialActivityController.getSocialActivities);

module.exports = router;
