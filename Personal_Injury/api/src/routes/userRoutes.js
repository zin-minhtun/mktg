const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authMiddleware");
const { check, body } = require('express-validator');

// Validation Rules
const createUserValidation = [
  check('email').isEmail().withMessage('Must be a valid email'),
  check('firstName').isString().notEmpty().isLength({ max: 50 }).withMessage('First name is required and must be less than 50 chars'),
  check('lastName').isString().notEmpty().isLength({ max: 50 }).withMessage('Last name is required and must be less than 50 chars'),
  check('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 chars long')
];

const updateUserValidation = [
  check('email').optional().isEmail().withMessage('Must be a valid email'),
  check('firstName').optional().isString().isLength({ max: 50 }).withMessage('Must be less than 50 chars'),
  check('lastName').optional().isString().isLength({ max: 50 }).withMessage('Must be less than 50 chars')
];

// RESTful routes for user management
router.post("/", createUserValidation, userController.createUser); // Public: Registration
router.get("/getUserId", userController.getUserId); // Public: For initial user check
router.put("/:userId", authenticateToken, updateUserValidation, userController.updateUser); // Protected: Update Profile
router.delete("/deleteUser", authenticateToken, userController.deleteUser); // Protected: Delete Account

// Healthcheck endpoint
router.get('/ping', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is working!'
  });
});

module.exports = router;