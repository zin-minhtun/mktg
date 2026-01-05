const express = require('express');
const router = express.Router();
const socialActivityController = require('../controllers/socialActivityController');

// Adding a new social activity entry
router.post('/', socialActivityController.addSocialActivity);

// Getting all social activity entries
router.get('/', socialActivityController.getSocialActivities);

router.delete('/delete/:id', socialActivityController.deleteSocialActivity);
router.put('/update/:id', socialActivityController.updateSocialActivity);

module.exports = router;
