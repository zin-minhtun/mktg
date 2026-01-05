const PainLog = require("../models/painModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const addPain = async (req, res) => {
  try {
    const {
      painName,
      userId,
      intensity,
      painLocation,
      painType,
      reliefFactors,
      triggers,
      limitations,
      worseningActivities,
      improvingActivities,
      painDistribution,
      painPattern,
      additionalNotes,
      date,
    } = req.body;

    // Validate required fields
    if (!painName || !userId || intensity === undefined || !painLocation || !painType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        required: ["painName", "userId", "intensity", "painLocation", "painType"]
      });
    }

    // Validate userId format
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    // Validate painName is not empty
    if (painName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Pain name cannot be empty"
      });
    }

    // Validate intensity range
    if (intensity < 0 || intensity > 5) {
      return res.status(400).json({
        success: false,
        message: "Intensity must be between 0 and 5"
      });
    }

    // Validate arrays are not empty
    if (!Array.isArray(painLocation) || painLocation.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one pain location must be selected"
      });
    }

    if (!Array.isArray(painType) || painType.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one pain type must be selected"
      });
    }

    // Validate userId exists (consider caching this check or removing if performance is an issue)
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Create pain log entry
    const painEntry = new PainLog({
      painName: painName.trim(),
      userId,
      intensity,
      painLocation,
      painType,
      reliefFactors: reliefFactors?.trim() || undefined,
      triggers: triggers?.trim() || undefined,
      limitations: limitations?.trim() || undefined,
      worseningActivities: worseningActivities?.trim() || undefined,
      improvingActivities: improvingActivities?.trim() || undefined,
      painDistribution: painDistribution?.trim() || undefined,
      painPattern: painPattern?.trim() || undefined,
      additionalNotes: additionalNotes?.trim() || undefined,
      date: date || undefined,
    });

    // Save the pain log
    const savedPainLog = await painEntry.save();

    res.status(201).json({
      success: true,
      message: "Pain log added successfully",
      data: savedPainLog
    });
  } catch (error) {
    console.error("Error adding pain log:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate entry detected"
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to add pain log",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getPainLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, limit = 50, page = 1 } = req.query;

    // Validate userId format
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    // Validate pagination parameters
    const parsedLimit = Math.min(Math.max(parseInt(limit) || 50, 1), 100); // Max 100 items
    const parsedPage = Math.max(parseInt(page) || 1, 1);

    // Build query
    const query = { userId };

    // Add date range filter if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid start date format"
          });
        }
        query.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include entire end date
        if (isNaN(end.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid end date format"
          });
        }
        query.date.$lte = end;
      }
    }

    // Execute query with pagination
    const skip = (parsedPage - 1) * parsedLimit;

    // Use Promise.all for parallel execution
    const [painLogs, total] = await Promise.all([
      PainLog.find(query)
        .sort({ date: -1 })
        .limit(parsedLimit)
        .skip(skip)
        .lean(),
      PainLog.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: painLogs,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        pages: Math.ceil(total / parsedLimit)
      }
    });
  } catch (error) {
    console.error("Error fetching pain logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pain logs",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getPainLogById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pain log ID format"
      });
    }

    const painLog = await PainLog.findById(id).lean();

    if (!painLog) {
      return res.status(404).json({
        success: false,
        message: "Pain log not found"
      });
    }

    res.status(200).json({
      success: true,
      data: painLog
    });
  } catch (error) {
    console.error("Error fetching pain log:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pain log",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const updatePainLog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Validate ID format
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pain log ID format"
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

    // Trim string fields
    const stringFields = [
      'painName', 'reliefFactors', 'triggers', 'limitations',
      'worseningActivities', 'improvingActivities', 'painDistribution',
      'painPattern', 'additionalNotes'
    ];

    stringFields.forEach(field => {
      if (updateData[field] && typeof updateData[field] === 'string') {
        updateData[field] = updateData[field].trim();
      }
    });

    // Validate intensity if provided
    if (updateData.intensity !== undefined) {
      if (updateData.intensity < 0 || updateData.intensity > 5) {
        return res.status(400).json({
          success: false,
          message: "Intensity must be between 0 and 5"
        });
      }
    }

    // Validate arrays if provided
    if (updateData.painLocation !== undefined) {
      if (!Array.isArray(updateData.painLocation) || updateData.painLocation.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one pain location must be selected"
        });
      }
    }

    if (updateData.painType !== undefined) {
      if (!Array.isArray(updateData.painType) || updateData.painType.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one pain type must be selected"
        });
      }
    }

    const painLog = await PainLog.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!painLog) {
      return res.status(404).json({
        success: false,
        message: "Pain log not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Pain log updated successfully",
      data: painLog
    });
  } catch (error) {
    console.error("Error updating pain log:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update pain log",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const deletePainLog = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pain log ID format"
      });
    }

    const painLog = await PainLog.findByIdAndDelete(id);

    if (!painLog) {
      return res.status(404).json({
        success: false,
        message: "Pain log not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Pain log deleted successfully",
      deletedId: id
    });
  } catch (error) {
    console.error("Error deleting pain log:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete pain log",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  addPain,
  getPainLogs,
  getPainLogById,
  updatePainLog,
  deletePainLog
};