const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../../controllers/AuthController/GoogleAuth.js");

// Google Authentication
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Callback routes for Success and Failure routes for Google Authentication

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: `http://localhost:5173/`, //Redirec to Client Home Page
    failureRedirect: "/auth/google/failure",
  })
);

// Logout routes for Google Authentication

router.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err, "Logout Failed");
      return res.json(err);
    }
    req.session = null;

    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.redirect("http://localhost:5173/");
  });
});
// Google Login Failure Routes

router.get("/auth/google/failure", (req, res) => {
  res.redirect("https://localhost:5173/signin");
});

// Successful google login Route

router.get("/auth/login/success", async (req, res) => {
  console.log(req.user, "user");
  if (req.user) {
    res.status(200).json({
      user: {
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        auth: true,
      },
      message: "Login success",
    });
  } else {
    res.json({ user: null, message: "Login failed" });
  }
});

module.exports = router;
