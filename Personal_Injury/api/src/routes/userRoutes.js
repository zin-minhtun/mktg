const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.route("/").post(userController.createUser);

router.route("/getUserId").get(userController.getUserId);
router.route("/:userId").put(userController.updateUser);
router.route("/deleteUser").delete(userController.deleteUser);

module.exports = router;
