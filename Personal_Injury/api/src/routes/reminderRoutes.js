const express = require("express");
const router = express.Router();
const reminderController = require("../controllers/reminderController");

// Create or update a reminder (upsert)
router.post("/", reminderController.saveReminder);

// Get all reminders for a user
router.get("/:userId", reminderController.getReminders);

// Delete a specific reminder
router.delete("/:id", reminderController.deleteReminder);

// Toggle reminder enabled/disabled
router.patch("/:id/toggle", reminderController.toggleReminder);

module.exports = router;
