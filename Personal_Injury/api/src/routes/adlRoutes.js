const express = require("express");
const router = express.Router();
const adlController = require("../controllers/adlController");

// Route to add ADL log
router.post("/add", adlController.addAdls);
router.get("/", adlController.getAdls);
router.delete("/delete/:id", adlController.deleteAdl);
router.put("/update/:id", adlController.updateAdl);

module.exports = router;
