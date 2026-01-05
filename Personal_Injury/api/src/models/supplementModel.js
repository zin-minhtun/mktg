const mongoose = require("mongoose");

const supplementSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: { type: String, required: true }, // e.g., 'vitamin', 'mineral'
        name: { type: String, required: true },
        dosage: { type: String },
        frequency: { type: String },
        howToTake: { type: String }, // 'water', 'milk', 'food', 'empty_stomach'
        startDate: { type: Date },
        endDate: { type: Date },
        reminderEnabled: { type: Boolean, default: false },
        reminderTime: { type: String },
        date: { type: Date }, // Creation date or focus date
    },
    {
        timestamps: true,
    }
);

const Supplement = mongoose.model("Supplement", supplementSchema);

module.exports = Supplement;
