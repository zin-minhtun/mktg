const CalendarEvent = require("../models/calendarEventModel");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

// Create a new calendar event
const createCalendarEvent = async (req, res) => {
  try {
    const { userId, email, event_name, date, start_time, end_time, notes } = req.body;

    // Validate required fields
    if (!userId || !email || !event_name || !date || !start_time || !end_time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate time format (should be like "10:00 AM")
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
    if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
      return res.status(400).json({ error: "Invalid time format. Use format like '10:00 AM'" });
    }

    // Validate date
    const eventDate = dayjs(date);
    if (!eventDate.isValid()) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const newEvent = new CalendarEvent({
      userId,
      email,
      event_name,
      date: eventDate.toDate(),
      start_time,
      end_time,
      notes: notes || "",
    });

    await newEvent.save();
    return res.status(201).json({ 
      message: "Calendar event created successfully", 
      event: newEvent 
    });

  } catch (error) {
    console.error("Error creating calendar event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all events for a specific user
const getUserEvents = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const events = await CalendarEvent.find({ userId }).sort({ date: 1, start_time: 1 });
    res.json(events);

  } catch (error) {
    console.error("Error fetching user events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get events for a specific date
const getEventsByDate = async (req, res) => {
  try {
    const { userId, date } = req.query;

    if (!userId || !date) {
      return res.status(400).json({ error: "userId and date are required" });
    }

    const startOfDay = dayjs(date).utc().startOf("day").toDate();
    const endOfDay = dayjs(date).utc().endOf("day").toDate();

    const events = await CalendarEvent.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ start_time: 1 });

    res.json(events);

  } catch (error) {
    console.error("Error fetching events by date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get events for a date range (for monthly view)
const getEventsByDateRange = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    if (!userId || !startDate || !endDate) {
      return res.status(400).json({ error: "userId, startDate, and endDate are required" });
    }

    const start = dayjs(startDate).utc().startOf("day").toDate();
    const end = dayjs(endDate).utc().endOf("day").toDate();

    const events = await CalendarEvent.find({
      userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1, start_time: 1 });

    res.json(events);

  } catch (error) {
    console.error("Error fetching events by date range:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get events grouped by month for yearly overview
const getYearlyEvents = async (req, res) => {
  try {
    const { userId, year } = req.query;

    if (!userId || !year) {
      return res.status(400).json({ error: "userId and year are required" });
    }

    const startOfYear = dayjs(`${year}-01-01`).utc().startOf("year").toDate();
    const endOfYear = dayjs(`${year}-12-31`).utc().endOf("year").toDate();

    const events = await CalendarEvent.find({
      userId,
      date: { $gte: startOfYear, $lte: endOfYear },
    }).sort({ date: 1 });

    // Group events by date for easy marking on calendar
    const eventsByDate = {};
    events.forEach(event => {
      const dateKey = dayjs(event.date).format("YYYY-MM-DD");
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }
      eventsByDate[dateKey].push(event);
    });

    res.json({ events, eventsByDate });

  } catch (error) {
    console.error("Error fetching yearly events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a calendar event
const updateCalendarEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { event_name, date, start_time, end_time, notes } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: "eventId is required" });
    }

    const event = await CalendarEvent.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Calendar event not found" });
    }

    // Update fields if provided
    if (event_name) event.event_name = event_name;
    if (date) {
      const eventDate = dayjs(date);
      if (!eventDate.isValid()) {
        return res.status(400).json({ error: "Invalid date format" });
      }
      event.date = eventDate.toDate();
    }
    if (start_time) {
      const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
      if (!timeRegex.test(start_time)) {
        return res.status(400).json({ error: "Invalid start_time format" });
      }
      event.start_time = start_time;
    }
    if (end_time) {
      const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
      if (!timeRegex.test(end_time)) {
        return res.status(400).json({ error: "Invalid end_time format" });
      }
      event.end_time = end_time;
    }
    if (notes !== undefined) event.notes = notes;

    await event.save();
    res.json({ message: "Event updated successfully", event });

  } catch (error) {
    console.error("Error updating calendar event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a calendar event
const deleteCalendarEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ error: "eventId is required" });
    }

    const event = await CalendarEvent.findByIdAndDelete(eventId);

    if (!event) {
      return res.status(404).json({ error: "Calendar event not found" });
    }

    res.json({ message: "Event deleted successfully", event });

  } catch (error) {
    console.error("Error deleting calendar event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createCalendarEvent,
  getUserEvents,
  getEventsByDate,
  getEventsByDateRange,
  getYearlyEvents,
  updateCalendarEvent,
  deleteCalendarEvent,
};
