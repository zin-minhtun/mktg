const mongoose = require("mongoose");

const onboardingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        answers: {
            // 1. Had personal injury accident in Ontario?
            hadPersonalInjuryOntario: { type: Boolean, default: null },

            // 2. Incident types (multi-select)
            incidentTypes: { type: [String], default: [] },

            // 3. Describe what happened (text)
            incidentDescription: { type: String, default: "" },

            // 4. When did this happen?
            incidentDateRange: { type: String, default: "" },

            // 5. Ability to work (multi-select + text)
            abilityToWork: { type: [String], default: [] },
            abilityToWorkDetails: { type: String, default: "" },

            // 6. Daily activities affected (multi-select + text)
            dailyActivitiesAffected: { type: [String], default: [] },
            dailyActivitiesDetails: { type: String, default: "" },

            // 7. Lawyer helping?
            hasLawyer: { type: String, default: "" },
            lawyerDetails: { type: String, default: "" },

            // 8. Feelings about next steps (multi-select)
            feelingsNext: { type: [String], default: [] },

            // 9. Emotional or psychological symptoms (multi-select)
            emotionalSymptoms: { type: [String], default: [] },

            // 10. Are you in therapy?
            inTherapy: { type: String, default: "" },

            // 11. Gender
            gender: { type: String, default: "" },

            // 12. Notification preferences
            notifications: {
                reminders: { type: Boolean, default: false },
                webinars: { type: Boolean, default: false },
                promotions: { type: Boolean, default: false },
            },
        },

        // Triage Result (Root Level)
        triageResult: {
            priority: {
                type: String,
                enum: ["HIGH", "MEDIUM", "LOW", "COURTESY", "MESSAGE"],
                default: null
            },
            reason: { type: String, default: "" },
            reasonCodes: { type: [String], default: [] },
            ui_to_display: { type: String, default: "" },
            consultation_offered: { type: Boolean, default: false },
            skip_consultation: { type: Boolean, default: false },
            next_steps: { type: [String], default: [] },
            userAction: { type: String, enum: ["BOOKED", "SKIPPED", "PENDING"], default: "PENDING" }
        },

        // Case Status
        caseStatus: {
            type: String,
            enum: ["NEW", "UNDER_REVIEW", "SIGNED", "REJECTED", "CLOSED"],
            default: "NEW"
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

module.exports = mongoose.model("Onboarding", onboardingSchema);
