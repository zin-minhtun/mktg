const express = require("express");
const router = express.Router();
const {
  addNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
} = require("../controllers/noteController");

// Create a new note
router.post("/add", addNote);

// Get all notes for a user
router.get("/user/:userId", getNotes);

// Get a specific note by ID
router.get("/:id", getNoteById);

// Update a note
router.put("/:id", updateNote);

// Delete a note
router.delete("/:id", deleteNote);

module.exports = router;