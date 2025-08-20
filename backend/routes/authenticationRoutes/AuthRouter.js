const express = require("express");
const {
  RegisterUser,
  LoginUser,
  Logout,
  RefreshToken,
  ForgetPassword,
  VerifyUserAuth,
  ResetPassword,
  SignupUser,
  SigninUser,
  SelectAccount,
} = require("../../controllers/AuthController/AuthController.js");

const router = express.Router();

// New User Sign up Route
router.post("/signup", SignupUser);

// User Sign Up As a Library Owner

router.post("/register",RegisterUser);


// Select an account
router.post('/select-account', SelectAccount)

// Log-in Route for Owner users only
router.post("/signin", LoginUser);

// Login to Library Domain directly.
router.post("/login", SigninUser);

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
