const express = require("express");
const router = express.Router();
const supplementController = require("../controllers/supplementController");

router.post("/add", supplementController.addSupplement);
router.get("/", supplementController.getSupplements);
router.put("/update/:id", supplementController.updateSupplement);
router.delete("/delete/:id", supplementController.deleteSupplement);

module.exports = router;
