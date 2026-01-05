const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const {
  addPain,
  getPainLogs,
  getPainLogById,
  updatePainLog,
  deletePainLog
} = require("../controllers/painController");

// Create a new pain log (Protected)
router.post("/add", authenticateToken, addPain);

// Get all pain logs for a user (Protected)
router.get("/user/:userId", authenticateToken, getPainLogs);

// Get a specific pain log by ID (Protected)
router.get("/:id", authenticateToken, getPainLogById);

// Update a pain log (Protected)
router.put("/:id", authenticateToken, updatePainLog);

// Delete a pain log (Protected)
router.delete("/:id", authenticateToken, deletePainLog);

module.exports = router;