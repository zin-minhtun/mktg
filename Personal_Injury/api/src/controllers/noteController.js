const Note = require("../models/noteModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const addNote = async (req, res) => {
  try {
    const { text, userId, category, tags } = req.body;

    // Validate required fields
    if (!text || !userId) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields",
        required: ["text", "userId"]
      });
    }

    // Validate userId format
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid user ID format" 
      });
    }

    // Validate text is not empty
    if (text.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Note text cannot be empty" 
      });
    }

    // Validate userId exists
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Create note entry
    const noteEntry = new Note({
      text: text.trim(),
      userId,
      category: category || "general",
      tags: tags || [],
    });

    // Save the note
    const savedNote = await noteEntry.save();

    res.status(201).json({
      success: true,
      message: "Note added successfully",
      data: savedNote
    });
  } catch (error) {
    console.error("Error adding note:", error);
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    res.status(500).json({ 
      success: false,
      message: "Failed to add note",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, category, limit = 50, page = 1 } = req.query;

    // Validate userId format
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid user ID format" 
      });
    }

    // Validate pagination parameters
    const parsedLimit = Math.min(Math.max(parseInt(limit) || 50, 1), 100);
    const parsedPage = Math.max(parseInt(page) || 1, 1);

    // Build query
    const query = { userId };

    // Add category filter if provided
    if (category) {
      query.category = category;
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
          return res.status(400).json({ 
            success: false,
            message: "Invalid start date format" 
          });
        }
        query.createdAt.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (isNaN(end.getTime())) {
          return res.status(400).json({ 
            success: false,
            message: "Invalid end date format" 
          });
        }
        query.createdAt.$lte = end;
      }
    }

    // Execute query with pagination
    const skip = (parsedPage - 1) * parsedLimit;
    
    const [notes, total] = await Promise.all([
      Note.find(query)
        .sort({ createdAt: -1 })
        .limit(parsedLimit)
        .skip(skip)
        .lean(),
      Note.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: notes,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        pages: Math.ceil(total / parsedLimit)
      }
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch notes",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid note ID format" 
      });
    }

    const note = await Note.findById(id).lean();

    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: "Note not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch note",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Validate ID format
    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid note ID format" 
      });
    }

    // Remove fields that shouldn't be updated
    const protectedFields = ['userId', 'createdAt', 'updatedAt', '_id', '__v'];
    protectedFields.forEach(field => delete updateData[field]);

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update"
      });
    }

    // Trim text field
    if (updateData.text && typeof updateData.text === 'string') {
      updateData.text = updateData.text.trim();
      if (updateData.text.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: "Note text cannot be empty" 
        });
      }
    }

    const note = await Note.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: "Note not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: note
    });
  } catch (error) {
    console.error("Error updating note:", error);
    
    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    res.status(500).json({ 
      success: false,
      message: "Failed to update note",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid note ID format" 
      });
    }

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: "Note not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      deletedId: id
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete note",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = { 
  addNote, 
  getNotes, 
  getNoteById, 
  updateNote, 
  deleteNote 
};