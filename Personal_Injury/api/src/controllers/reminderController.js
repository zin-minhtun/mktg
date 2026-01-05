const Reminder = require("../models/reminderModel");

/**
 * Save or update a reminder (upsert pattern)
 * Uses userId + type as compound key (one reminder per type per user)
 */
exports.saveReminder = async (req, res) => {
    const {
        userId,
        type,
        enabled,
        message,
        scheduleKind,
        intervalMinutes,
        time,
        daysOfWeek,
        startDate,
        endDate,
        linkedItems
    } = req.body;

    if (!userId || !type) {
        return res.status(400).json({
            success: false,
            message: "userId and type are required"
        });
    }

    // Validate schedule based on kind
    if (scheduleKind === "interval" && !intervalMinutes) {
        return res.status(400).json({
            success: false,
            message: "intervalMinutes required for interval schedule"
        });
    }

    if ((scheduleKind === "daily" || scheduleKind === "weekly") && !time) {
        return res.status(400).json({
            success: false,
            message: "time required for daily/weekly schedule"
        });
    }

    if (scheduleKind === "weekly" && (!daysOfWeek || daysOfWeek.length === 0)) {
        return res.status(400).json({
            success: false,
            message: "daysOfWeek required for weekly schedule"
        });
    }

    try {
        const updateData = {
            enabled: enabled !== undefined ? enabled : true,
            message: message || "",
            scheduleKind: scheduleKind || "none",
        };

        // Add schedule-specific fields
        if (scheduleKind === "interval") {
            updateData.intervalMinutes = intervalMinutes;
            updateData.time = undefined;
            updateData.daysOfWeek = undefined;
        } else if (scheduleKind === "daily") {
            updateData.time = time;
            updateData.intervalMinutes = undefined;
            updateData.daysOfWeek = undefined;
        } else if (scheduleKind === "weekly") {
            updateData.time = time;
            updateData.daysOfWeek = daysOfWeek;
            updateData.intervalMinutes = undefined;
        }

        // Optional fields
        if (startDate) updateData.startDate = startDate;
        if (endDate) updateData.endDate = endDate;
        if (linkedItems) updateData.linkedItems = linkedItems;

        const reminder = await Reminder.findOneAndUpdate(
            { userId, type }, // Find by compound key
            updateData,
            {
                new: true,
                upsert: true, // Create if doesn't exist
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        );

        console.log(`Reminder saved: ${type} for user ${userId}`);

        return res.status(200).json({
            success: true,
            data: reminder
        });
    } catch (err) {
        console.error("Error saving reminder:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * Get all reminders for a user
 */
exports.getReminders = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "userId is required"
        });
    }

    try {
        const reminders = await Reminder.find({ userId }).sort({ type: 1 });

        return res.status(200).json({
            success: true,
            data: reminders
        });
    } catch (err) {
        console.error("Error fetching reminders:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * Delete a specific reminder
 */
exports.deleteReminder = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Reminder ID is required"
        });
    }

    try {
        const deleted = await Reminder.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Reminder not found"
            });
        }

        console.log(`Reminder deleted: ${id}`);

        return res.status(200).json({
            success: true,
            message: "Reminder deleted successfully"
        });
    } catch (err) {
        console.error("Error deleting reminder:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * Toggle reminder enabled/disabled state
 */
exports.toggleReminder = async (req, res) => {
    const { id } = req.params;
    const { enabled } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Reminder ID is required"
        });
    }

    if (typeof enabled !== "boolean") {
        return res.status(400).json({
            success: false,
            message: "enabled must be a boolean"
        });
    }

    try {
        const reminder = await Reminder.findByIdAndUpdate(
            id,
            { enabled },
            { new: true, runValidators: true }
        );

        if (!reminder) {
            return res.status(404).json({
                success: false,
                message: "Reminder not found"
            });
        }

        console.log(`Reminder toggled: ${id}, enabled=${enabled}`);

        return res.status(200).json({
            success: true,
            data: reminder
        });
    } catch (err) {
        console.error("Error toggling reminder:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
