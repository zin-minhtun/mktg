const User = require("../models/userModel");
const Onboarding = require("../models/onboardingModel");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');

exports.getUserId = async (req, res) => {
  const email = req.query.email; // Use req.query to get query parameters
  const user = await User.findOne({ email: email });
  console.log(user);

  if (user) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });
    res.status(200).json({
      status: "Success",
      token,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dateOfBirth,
        personalInjuryAccident: user.personalInjuryAccident,
        accidentDate: user.accidentDate,
        hasLawyer: user.hasLawyer,
        insuranceApproval: user.insuranceApproval,
        inTherapy: user.inTherapy,
        preCondition: user.preCondition,
        profilePicture: user.profilePicture,
      },
    });
  } else {
    res.status(404).json({
      status: "Fail",
      message: "User not found",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    console.log("[UserController] ========== createUser ==========");

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "Fail", errors: errors.array() });
    }

    console.log("[UserController] Request body:", JSON.stringify(req.body, null, 2));

    // Extract user data from the request body
    const { firstName, lastName, email, dateOfBirth, uid, onboardingId } = req.body;

    // Log onboardingId status
    if (onboardingId) {
      console.log("[UserController] ✓ onboardingId received:", onboardingId);
    } else {
      console.log("[UserController] ⚠️  No onboardingId provided");
    }

    // Create a new user document using the userModel
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      dateOfBirth,
      uid,
    });

    console.log("[UserController] ✓ User created in database");
    console.log("[UserController] New user ID:", newUser._id.toString());

    // If onboardingId is provided, attach the user to the onboarding record
    if (onboardingId) {
      console.log("[UserController] Attempting to attach onboarding...");
      try {
        const updatedOnboarding = await Onboarding.findByIdAndUpdate(
          onboardingId,
          { userId: newUser._id },
          { new: true }
        );

        if (updatedOnboarding) {
          console.log("[UserController] ✓ Onboarding attached successfully");
          console.log("[UserController] Onboarding now linked to userId:", updatedOnboarding.userId.toString());
        } else {
          console.log("[UserController] ❌ Onboarding record not found for ID:", onboardingId);
        }
      } catch (onboardingError) {
        console.error("[UserController] ❌ Error attaching onboarding:", onboardingError.message);
        // Don't fail the entire user creation if onboarding attachment fails
      }
    }

    // Send a response back to the client
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });

    res.status(201).json({
      status: "Success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    console.error("[UserController] ❌ Error creating user:", err.message);
    console.error("[UserController] Stack:", err.stack);
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    console.log("Delete User request"); // for debugging - to remove
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        status: "Failed",
        message: "User ID is required",
      });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    console.log("User found in DB :", user); // for debugging - to remove

    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "User not found",
      });
    }

    // Delete related data
    await user.deleteRelatedData();

    // Delete the user
    await user.deleteOne();

    res.status(200).json({
      status: "Success",
      message: "User Account has been deleted successfully.",
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "Fail", errors: errors.array() });
    }

    console.log("Updating User");
    const { userId } = req.params;
    const dataToUpdate = req.body;
    console.log("userId : ", userId);
    console.log("dataToUpdate : ", dataToUpdate);
    // Find the user by ID and update
    const updatedUser = await User.findByIdAndUpdate(userId, dataToUpdate, {
      new: true, // return the new updated document
      runValidators: true, // ensure the update is valid according to the schema
    });

    if (!updatedUser) {
      return res.status(404).json({
        status: "Failed",
        message: "User not found",
      });
    }

    console.log("updatedUser in DB : ", updatedUser); // for debugging - to remove
    res.status(200).json({ status: "Success", data: updatedUser });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};
