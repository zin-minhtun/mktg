const express = require("express");
const router = express.Router();
const painController = require("../controllers/painController");

// Route to add pain log
router.post("/add", painController.addPain);

module.exports = router;
