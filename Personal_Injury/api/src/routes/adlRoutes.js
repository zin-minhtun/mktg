const express = require("express");
const router = express.Router();
const adlController = require("../controllers/adlController");

// Route to add ADL log
router.post("/add", adlController.addAdls);

module.exports = router;
