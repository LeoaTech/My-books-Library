const express = require("express");
const {
  RegisterUser,
  LoginUser
} = require("../../controllers/AuthController/AuthController.js");

const router = express.Router();

// New User Sign up Route
router.post("/signup", RegisterUser);

// Log-in Route
router.post("/signin", LoginUser);

module.exports = router;
