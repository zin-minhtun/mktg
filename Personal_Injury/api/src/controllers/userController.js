const User = require("../models/userModel");
exports.getUserId = async (req, res) => {
  const email = req.query.email; // Use req.query to get query parameters
  const user = await User.findOne({ email: email });
  console.log(user);

  if (user) {
    res.status(200).json({
      status: "Success",
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dateOfBirth,
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
    console.log("create User");
    // Extract user data from the request body
    const { firstName, lastName, email, dateOfBirth, uid } = req.body;
    console.log(req.body);
    // Create a new user document using the userModel
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      dateOfBirth,
      uid,
    });
    // Send a response back to the client
    res.status(201).json({
      status: "Success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};

// exports.updateUser = async (req, res) => {
//   try {
//     console.log("Updating User");
//     const { userId } = req.params;
//     const dataToUpdate = req.body;

//     // Find the user by ID and update
//     const updatedUser = await User.findByIdAndUpdate(userId, dataToUpdate, {
//       new: true, // return the new updated document
//       runValidatiors: true, // ensure the update is valid according to the schema
//     });

//     if (!updatedUser) {
//       return res.status(404).json({
//         status: "Failed",
//         message: "User not found",
//       });
//     }

//     console.log("updatedUser in DB : ", updatedUser); // for debugging - to remove
//     res.status(200).json({ status: "Success", data: updatedUser });
//   } catch (err) {
//     res.status(400).json({
//       status: "Failed",
//       message: err.message,
//     });
//   }
// };

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
