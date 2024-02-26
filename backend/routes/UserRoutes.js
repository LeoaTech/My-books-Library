const express = require("express");
const {
  getAllUsers,
  UpdateRoles,
  DeleteUser,
  getUserProfile,
} = require("../controllers/userController/UserController");

const router = express.Router();

// Get All Users
router.get("/", getAllUsers);

// Delete a User Profile
router.delete("/:user_id", DeleteUser);


module.exports = router;
