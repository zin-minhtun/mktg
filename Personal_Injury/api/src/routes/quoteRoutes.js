const express = require("express");
const router = express.Router();
const quotesController = require("../controllers/quotesController");


// Route to get arandom quote
router.get("/random", quotesController.getRandomQuote);

module.exports = router;
