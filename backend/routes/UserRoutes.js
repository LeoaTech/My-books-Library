const express = require("express");
const {
  getAllUsers,
  UpdateRoles,
  DeleteUser,
  getUserProfile,
  getLibraryUsers
} = require("../controllers/userController/UserController");
const {checkAuth} = require("../middleware/authMiddleware")
const router = express.Router();

router.use(checkAuth);
// Get All Users
// router.get("/", getAllUsers);

//Todo: Verify Role and  Permissions to access these routes

// Get a particular Library User
router.get("/",getLibraryUsers)

// Delete a User Profile
router.delete("/:user_id", DeleteUser);
// Get User Profile by User ID
router.get("/user", getUserProfile);
/* Protect these Route For Admins Only */
//Update Role of a User
router.put("/:user_id/role", UpdateRoles);


module.exports = router;
