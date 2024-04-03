const express = require("express");
const router = express.Router();
const passport = require("passport");

const { Client } = require("pg");
const connectionUrl = process.env.CONNECTION_URL;

const client = new Client(connectionUrl);

client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Authentication API connected");
  }
});

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

    req.session.cookie.originalMaxAge = 0;

    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.send("Logout user");
    // res.redirect(`${process.env.CLIENT_URL}/`)
  });
});
// Google Login Failure Routes

router.get("/auth/google/failure", (req, res) => {
  console.log(req.user, "user Failed");

  res.redirect("https://localhost:5173/signin");
});

// Successful google login Route

router.get("/auth/login/success", async (req, res) => {
  if (req.user) {
    const checkRole = await client.query(
      "SELECT name FROM roles Where role_id=  $1",
      [req.user?.role_id]
    );
    let role_name;

    if (checkRole?.rowCount > 0) {
      role_name = checkRole?.rows[0]?.name;
    }

    res.status(200).json({
      user: {
        email: req.user.email,
        name: req.user.name,
        role: req.user.role_id,
        role_name: role_name,
        auth: true,
      },
      message: "Login success",
    });
  } else {
    res.json({ user: null, message: "Login failed" });
  }
});

module.exports = router;
