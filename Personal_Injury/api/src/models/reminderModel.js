const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: ["Medication", "Supplement", "Water", "Meal", "Sleep", "DailyCheckin"],
            required: true,
        },

        enabled: {
            type: Boolean,
            default: true,
        },

        message: {
            type: String,
            trim: true,
            maxlength: 200,
        },

        // Schedule configuration
        scheduleKind: {
            type: String,
            enum: ["none", "interval", "daily", "weekly"],
            default: "none",
        },

        // For interval schedule (minutes)
        intervalMinutes: {
            type: Number,
            min: 15,
            max: 1440, // 24 hours
        },

        // For daily/weekly schedule (HH:MM)
        time: {
            type: String,
            match: /^([01]\d|2[0-3]):([0-5]\d)$/,
        },

        // For weekly schedule (0=Sunday, 6=Saturday)
        daysOfWeek: [{
            type: Number,
            min: 0,
            max: 6,
        }],

        // Optional: for bounded reminders (future enhancement)
        startDate: {
            type: Date,
        },

        endDate: {
            type: Date,
        },

        // For Medication type: link to journal medications (optional)
        linkedItems: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medication",
        }],
    },
    {
        timestamps: true
    }
);

// Compound index for efficient user queries - one reminder per type per user
reminderSchema.index({ userId: 1, type: 1 }, { unique: true });

// Immutable creation timestamp
reminderSchema.path("createdAt").immutable(true);

const Reminder = mongoose.model("Reminder", reminderSchema);

module.exports = Reminder;
