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
// Get User Profile by User ID
router.get("/user", getUserProfile);
/* Protect these Route For Admins Only */
//Update Role of a User
router.put("/:user_id/role", UpdateRoles);


module.exports = router;
