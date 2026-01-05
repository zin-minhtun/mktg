const Onboarding = require("../models/onboardingModel");
const mongoose = require("mongoose");

// --- TRIAGE ENGINE LOGIC ---

/**
 * Deterministic Triage Engine
 * Precedence: COURTESY > HIGH > MEDIUM > MESSAGE_ONLY
 */
const calculateTriage = (answers) => {
    // defaults
    const result = {
        priority: "MESSAGE", // defaulting to MESSAGE_ONLY as the catch-all
        reason: "Does not meet higher priority criteria.",
        reasonCodes: [],
        ui_to_display: "UI_MESSAGE_MODAL",
        consultation_offered: false,
        skip_consultation: false,
        next_steps: ["UI_TERMS_AND_CONDITIONS", "UI_INTRO_VIDEO", "UI_HOME"],
        userAction: "PENDING"
    };

    if (!answers) return result;

    const incidentTypes = answers.incidentTypes || [];
    const adlDifficulties = answers.dailyActivitiesAffected || [];
    const abilityToWork = answers.abilityToWork || [];
    const emotionalSymptoms = answers.emotionalSymptoms || [];
    const feelingsNext = answers.feelingsNext || [];
    const hasLawyer = answers.hasLawyer;

    // 1. COURTESY CHECK
    if (hasLawyer === "Yes") {
        result.priority = "COURTESY";
        result.reason = "User already has a lawyer.";
        result.reasonCodes.push("HAS_LAWYER");
        result.ui_to_display = "UI_COURTESY_MODAL";
        result.consultation_offered = false; // No consultation if they have a lawyer? (As per previous logic)
        result.skip_consultation = true;
        return result;
    }

    // 2. HIGH PRIORITY CHECK
    const highAccidents = [
        "Motor Vehicle Accident (Car Accident)",
        "Motorcycle Accident",
        "Pedestrian Accident",
        "Bicycle Accident",
        "Watercraft / Boating Accident"
    ];
    // Work Critical: "I haven't been able to return to work"
    // Emotional Red Flags: 2+ symptoms AND "I'm confused and need guidance right away"

    const isHighAccident = incidentTypes.some(type => highAccidents.includes(type));
    const isHighADL = adlDifficulties.length >= 3;
    const isHighWork = abilityToWork.includes("I haven't been able to return to work");
    const isHighEmotional = (emotionalSymptoms.length >= 2) && feelingsNext.includes("I'm confused and need guidance right away");

    if (isHighAccident || isHighADL || isHighWork || isHighEmotional) {
        result.priority = "HIGH";
        let reasons = [];
        let codes = [];
        if (isHighAccident) { reasons.push("Serious Accident"); codes.push("HIGH_ACCIDENT"); }
        if (isHighADL) { reasons.push("High ADL Impact"); codes.push("HIGH_ADL"); }
        if (isHighWork) { reasons.push("Critical Work Impact"); codes.push("HIGH_WORK"); }
        if (isHighEmotional) { reasons.push("Emotional Red Flags"); codes.push("HIGH_EMOTIONAL"); }

        result.reason = `High criteria met: ${reasons.join(", ")}`;
        result.reasonCodes = codes;
        result.ui_to_display = "UI_HIGH_PRIORITY_MODAL";
        result.consultation_offered = true;
        result.skip_consultation = false;
        return result;
    }

    // 3. MEDIUM PRIORITY CHECK
    const mediumAccidents = [
        "Slip & Fall",
        "Dog Bite / Animal Attack",
        "Concussion / Head Injury",
        "Assault / Physical Attack",
        "Medical Malpractice",
        "Product or Equipment Failure"
    ];
    // ADL + Work Struggle: >= 1 ADL AND "I've returned, but I'm still struggling"

    const isMediumAccident = incidentTypes.some(type => mediumAccidents.includes(type));
    const isMediumADLWork = (adlDifficulties.length >= 1) && abilityToWork.includes("I've returned, but I'm still struggling");

    if (isMediumAccident || isMediumADLWork) {
        result.priority = "MEDIUM";
        let reasons = [];
        let codes = [];
        if (isMediumAccident) { reasons.push("Medium Severity Accident"); codes.push("MEDIUM_ACCIDENT"); }
        if (isMediumADLWork) { reasons.push("ADL + Work Struggle"); codes.push("MEDIUM_WORK_ADL"); }

        result.reason = `Medium criteria met: ${reasons.join(", ")}`;
        result.reasonCodes = codes;
        result.ui_to_display = "UI_MEDIUM_PRIORITY_MODAL";
        result.consultation_offered = true;
        result.skip_consultation = false;
        return result;
    }

    // 4. MESSAGE_ONLY (Catch-all)
    // Previously "LOW" or "MESSAGE". User requested "MESSAGE_ONLY".
    // We stick to the default object defined at start.
    return result;
};


// 1. Start Onboarding
exports.startOnboarding = async (req, res) => {
    try {
        const newOnboarding = new Onboarding({
            answers: {},
            caseStatus: "NEW"
        });
        await newOnboarding.save();

        res.status(201).json({
            message: "Onboarding started",
            onboardingId: newOnboarding._id,
            onboarding: newOnboarding
        });
    } catch (error) {
        console.error("[Onboarding] Start error:", error);
        res.status(500).json({ message: "Failed to start onboarding", error: error.message });
    }
};

// 2. Update Answers (Partial Merge)
exports.updateAnswers = async (req, res) => {
    try {
        const { onboardingId, answers } = req.body;

        if (!onboardingId) {
            return res.status(400).json({ message: "onboardingId is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(onboardingId)) {
            return res.status(400).json({ message: "Invalid onboardingId format" });
        }

        const updateFields = {};
        for (const [key, value] of Object.entries(answers)) {
            updateFields[`answers.${key}`] = value;
        }

        const updatedOnboarding = await Onboarding.findByIdAndUpdate(
            onboardingId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedOnboarding) {
            console.warn(`[Onboarding] Update failed - ID not found: ${onboardingId}`);
            return res.status(404).json({
                message: "Onboarding record not found",
                code: "ONBOARDING_NOT_FOUND"
            });
        }

        res.status(200).json({
            message: "Onboarding updated",
            onboarding: updatedOnboarding
        });

    } catch (error) {
        console.error("[Onboarding] Update error:", error);
        res.status(500).json({ message: "Failed to update onboarding", error: error.message });
    }
};

// 3. Verify Onboarding Exists
exports.verifyOnboardingExists = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(200).json({ exists: false, message: "Invalid ID format" });
        }

        const exists = await Onboarding.exists({ _id: id });

        res.status(200).json({
            exists: !!exists,
            onboardingId: id
        });
    } catch (error) {
        console.error("[Onboarding] Verify error:", error);
        res.status(500).json({ message: "Verification failed", error: error.message });
    }
};

// 4. Attach User to Onboarding
exports.attachUserToOnboarding = async (onboardingId, userId) => {
    try {
        if (!onboardingId || !userId) return null;

        const updated = await Onboarding.findByIdAndUpdate(
            onboardingId,
            { userId: userId },
            { new: true }
        );

        if (updated) {
            // Success silently
        }
        return updated;
    } catch (error) {
        console.error("[Onboarding] Attach user error:", error);
        return null;
    }
};

// 5. Complete Onboarding (Triage Engine)
exports.completeOnboarding = async (req, res) => {
    try {
        const { onboardingId } = req.body;

        if (!onboardingId) {
            return res.status(400).json({ message: "onboardingId is required" });
        }

        const onboarding = await Onboarding.findById(onboardingId);
        if (!onboarding) {
            return res.status(404).json({ message: "Onboarding record not found" });
        }

        const answers = onboarding.answers || {};

        // Calculate Triage
        const triageResult = calculateTriage(answers);

        // Update Doc (Root Level)
        onboarding.triageResult = triageResult;

        // Only layout initial caseStatus if not already set (or reset it?)
        // Assuming completion implies moving to "UNDER_REVIEW" if High/Medium? 
        // Or keep as NEW. User said "Add caseStatus", let's keep it simplish, maybe default/NEW is fine.
        // But if we have a triage result, the status is effectively "TRIAGED".
        // Let's leave it as is or set to NEW. The engine essentially classifies it.

        await onboarding.save();

        // Also save to answers.triageResult for backward compatibility if needed? 
        // NO, user said "Do NOT duplicate". I will adhere to the new structure. 
        // Frontend 'getOnboardingStatus' must be updated to return root.

        return res.json(triageResult);

    } catch (error) {
        console.error("[Onboarding] Triage error:", error);
        res.status(500).json({ message: "Triage failed", error: error.message });
    }
};

// 6. Get Onboarding Status
exports.getOnboardingStatus = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        // Get latest
        const onboarding = await Onboarding.findOne({ userId: userId }).sort({ createdAt: -1 });

        if (!onboarding) {
            return res.status(404).json({ message: "No onboarding record found for this user" });
        }

        // Return root triageResult. Fallback to answers.triageResult if root is missing (legacy compat)
        const result = onboarding.triageResult && onboarding.triageResult.priority ?
            onboarding.triageResult :
            (onboarding.answers ? onboarding.answers.triageResult : null);

        res.status(200).json({
            status: "Success",
            triageResult: result,
            caseStatus: onboarding.caseStatus,
            onboardingId: onboarding._id
        });
    } catch (error) {
        console.error("[Onboarding] Get status error:", error);
        res.status(500).json({ message: "Failed to get status", error: error.message });
    }
};

// 7. Update Triage Action
exports.updateTriageAction = async (req, res) => {
    try {
        const { onboardingId, action } = req.body;

        if (!onboardingId || !action) {
            return res.status(400).json({ message: "onboardingId and action are required" });
        }

        if (!["BOOKED", "SKIPPED"].includes(action)) {
            return res.status(400).json({ message: "Invalid action. Must be BOOKED or SKIPPED" });
        }

        const onboarding = await Onboarding.findById(onboardingId);
        if (!onboarding) return res.status(404).json({ message: "Onboarding record not found" });

        // Update root triageResult
        if (!onboarding.triageResult) {
            onboarding.triageResult = {};
        }
        onboarding.triageResult.userAction = action;

        // Also update caseStatus?
        // If BOOKED -> maybe specific status? For now just keeping action.

        await onboarding.save();

        res.status(200).json({
            status: "Success",
            message: "Action updated successfully",
            triageResult: onboarding.triageResult
        });

    } catch (error) {
        console.error("[Onboarding] Update action error:", error);
        res.status(500).json({ message: "Failed to update action", error: error.message });
    }
};

// 8. Recompute Triage for All (Admin/Internal)
exports.recomputeAllTriage = async (req, res) => {
    try {
        console.log("[Onboarding] Starting Recompute All Triage...");
        const allOnboardings = await Onboarding.find({});
        let count = 0;

        for (const doc of allOnboardings) {
            // Apply logic
            const answers = doc.answers || {};
            const result = calculateTriage(answers);

            doc.triageResult = result;

            // Set default caseStatus if missing
            if (!doc.caseStatus) {
                doc.caseStatus = "NEW";
            }

            await doc.save();
            count++;
        }

        console.log(`[Onboarding] Recomputed triage for ${count} records.`);
        res.json({ message: `Recomputed triage for ${count} records`, count });

    } catch (error) {
        console.error("[Onboarding] Recompute error:", error);
        res.status(500).json({ message: "Recompute failed", error: error.message });
    }
};
// 9. Get ALL Onboardings (Admin)
exports.getAllOnboardings = async (req, res) => {
    try {
        // FILTER: Only return onboarding records with a valid userId (completed signups)
        // This prevents incomplete/orphaned records from appearing in admin dashboard
        const onboardings = await Onboarding.find({
            userId: { $exists: true, $ne: null }
        })
            .populate('userId', 'email firstName lastName uid')
            .sort({ createdAt: -1 });
        res.status(200).json(onboardings);
    } catch (e) {
        console.error("GetAll Error:", e);
        res.status(500).json({ error: e.message });
    }
};

// 10. Get Onboarding By ID (Admin)
exports.getOnboardingById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

        const doc = await Onboarding.findById(id).populate('userId', 'email firstName lastName uid');
        if (!doc) return res.status(404).json({ message: "Not found" });

        res.status(200).json(doc);
    } catch (e) {
        console.error("GetById Error:", e);
        res.status(500).json({ error: e.message });
    }
};
