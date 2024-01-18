const express = require("express");
const {
  RegisterUser,
  LoginUser,
  Logout,
  RefreshToken,
  ForgetPassword,
  VerifyUserAuth,
  ResetPassword,
} = require("../../controllers/AuthController/AuthController.js");

const router = express.Router();

// New User Sign up Route
router.post("/signup", RegisterUser);

// Log-in Route
router.post("/signin", LoginUser);

// Logout Route for  email/password
router.get("/user/logout", Logout);

// Refresh token after 5 min

router.get("/refresh", RefreshToken);

// Forgot Password Route
router.post("/forgot-password", ForgetPassword);


// Verify Reset Password Email Link Token
router.get(`/forgotpassword/:id/:token`, VerifyUserAuth);


// Reset Password with forgot Password Email Link
router.post("/reset-password/:id/:token", ResetPassword);


module.exports = router;
