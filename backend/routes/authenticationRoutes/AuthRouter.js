const express = require("express");
const {
  RegisterUser,
  LogoutUser,
  ForgetPassword,
  LoginUser,
  RefreshToken,
} = require("../../controllers/AuthController/AuthController.js");

const router = express.Router();

// Sign up Route
router.post("/account/signup", RegisterUser);

// Sign in Route
router.post("/account/signin", LoginUser);

// Refresh token after 5 min

router.post("/account/refresh", RefreshToken)
// Log out Route

router.post("/account/logout", LogoutUser);

// Forgot Password Route

router.post("/account/forgot-password", ForgetPassword);



module.exports = router;