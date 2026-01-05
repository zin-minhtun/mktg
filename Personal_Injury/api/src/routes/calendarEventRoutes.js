const express = require("express");
const router = express.Router();
const {
  createCalendarEvent,
  getUserEvents,
  getEventsByDate,
  getEventsByDateRange,
  getYearlyEvents,
  updateCalendarEvent,
  deleteCalendarEvent,
} = require("../controllers/calendarEventController");

// Create a new calendar event
router.post("/", createCalendarEvent);

// Get all events for a user
router.get("/", getUserEvents);

// Get events for a specific date
router.get("/date", getEventsByDate);

// Get events for a date range
router.get("/range", getEventsByDateRange);

// Get yearly events (for yearly overview)
router.get("/yearly", getYearlyEvents);

// Update a calendar event
router.put("/:eventId", updateCalendarEvent);

// Delete a calendar event
router.delete("/:eventId", deleteCalendarEvent);

module.exports = router;
