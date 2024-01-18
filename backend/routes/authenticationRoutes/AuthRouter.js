const express = require("express");
const {
  RegisterUser,
  LoginUser,
  Logout,
} = require("../../controllers/AuthController/AuthController.js");

const router = express.Router();

// New User Sign up Route
router.post("/signup", RegisterUser);

// Log-in Route
router.post("/signin", LoginUser);

// Logout Route for  email/password
router.get("/user/logout", Logout);

module.exports = router;
