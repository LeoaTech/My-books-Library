const express = require("express");
const {
  RegisterUser
} = require("../../controllers/AuthController/AuthController.js");

const router = express.Router();

// New User Sign up Route
router.post("/signup", RegisterUser);

module.exports = router;
