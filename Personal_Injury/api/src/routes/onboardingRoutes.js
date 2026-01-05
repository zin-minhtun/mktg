const express = require("express");
const router = express.Router();
const onboardingController = require("../controllers/onboardingController");

// Start a new onboarding session
router.post("/onboarding/start", onboardingController.startOnboarding);

// Update existing onboarding answers (partial update)
router.put("/onboarding/update", onboardingController.updateAnswers);

// Verify if an onboarding ID exists
router.get("/onboarding/verify/:id", onboardingController.verifyOnboardingExists);

// Complete onboarding and get triage decision
router.post("/onboarding/complete", onboardingController.completeOnboarding);

// Get onboarding status/triage result for a user
router.get("/user/:userId/status", onboardingController.getOnboardingStatus);

// Update Triage Action (Booked/Skipped)
router.post("/onboarding/action", onboardingController.updateTriageAction);

// Recompute Triage for all records (Admin/Internal)
router.post("/onboarding/recompute-triage", onboardingController.recomputeAllTriage);

// Admin Routes
router.get("/onboarding/all", onboardingController.getAllOnboardings);
router.get("/onboarding/:id", onboardingController.getOnboardingById);

module.exports = router;
