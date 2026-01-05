const express = require("express");
const router = express.Router();
const bodyCompositionController = require("../controllers/bodyCompositionController");

// Adding a new body composition entry
router.post("/", bodyCompositionController.addBodyComposition);

// Getting all body composition entries
router.get("/", bodyCompositionController.getBodyCompositions);

module.exports = router;
