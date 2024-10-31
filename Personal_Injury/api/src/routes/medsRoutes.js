const express = require("express");
const router = express.Router();
const medController = require("../controllers/medsController");

// Route to add a new medication
router.post("/add", medController.addMed);

// Route to add medication(s) to the category
router.post("/addMedsToCat", medController.addMedsToCat);

// Route to update medication
router.put("/update", medController.updateMed);

// Route to get all medication categories
router.get("/categories", medController.getAllCategories);

// Route to get all medications
router.get("/", medController.getAllMeds);

// Route to get all medication records of current date
router.get("/records/:userId", medController.getAllMedsRecords);

module.exports = router;
