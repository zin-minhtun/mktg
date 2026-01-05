const express = require("express");
const router = express.Router();
const sleepController = require("../controllers/sleepController");

// Route to add sleep log
router.post("/add", sleepController.addSleep);

module.exports = router;
