const express = require("express");
const router = express.Router();
const passport = require("passport");
const db = require("../../config/dbConfig.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

require("../../controllers/AuthController/GoogleAuth.js");

const refreshToken = (data) => {
  return jwt.sign({ data }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "3h", //in production 1 day
  });
};
// Google Authentication

router.get("/auth/google", (req, res, next) => {
  const action = req.query.action; // 'create_lib' or 'join_lib'
  const subdomain = req.query.subdomain;

  let stateObj = { action };

  if (action === "join_lib") {
    if (!subdomain) {
      return res
        .status(400)
        .json({ error: "Subdomain required for library signup" });
    }
    stateObj.subdomain = subdomain;
  }

  // Encode state as base64 to safely pass JSON
  const state = Buffer.from(JSON.stringify(stateObj)).toString("base64");

  passport.authenticate("google", {
    scope: ["email", "profile"],
    state: state,
  })(req, res, next);
});

// Callback routes for Success and Failure routes for Google Authentication

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: `http://localhost:5173/`, //Redirect to Client Home Page
    failureRedirect: "/auth/google/failure",
    failureMessage:true,
    
  })
);

// Logout routes for Google Authentication

router.get("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.clearCookie("connect.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ message: "Logout successful" });
  });
});

// Google Login Failure Routes
router.get("/auth/google/failure", (req, res) => {

  const errorMessage = req.session.messages?.[0] || "Authentication failed";
  console.log("Authentication failed:", errorMessage);

  // Redirect to the client-side failure page with an error message
  res.redirect(
    `http://localhost:5173/auth/failure?error=${encodeURIComponent(
      errorMessage
    )}`
  );
});

// Successful google login Route
router.get("/auth/login/success", async (req, res) => {
  if (req.user) {
    // console.log(req.user, "Google Success Signin");

    const result = await db.query(
      `
     SELECT 
        uer.user_id, uer.entity_id, uer.branch_id, uer.role_id,
        e.name AS entity_name, e.subdomain,
        b.name AS branch_name,
        r.name AS role_name,
        u.email,u.password, u.name
      FROM user_entity_roles uer
      JOIN entity e ON uer.entity_id = e.id
      JOIN branches b ON uer.branch_id = b.id
      JOIN roles r ON uer.role_id = r.role_id
      JOIN users u ON uer.user_id = u.id
      WHERE uer.user_id = $1 AND uer.entity_id = $2 AND uer.branch_id = $3 AND uer.role_id = $4
      `,
      [
        req.user?.user_id,
        req.user?.entity_id,
        req.user.branch_id,
        req.user.role_id,
      ]
    );

    // console.log(result.rows[0], "DB User data");
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid User Credentials" });
    }

    const user = result.rows[0];

    const user_info = {
      userId: user.user_id,
      roleId: user.role_id,
      branchId: user.branch_id,
      entityId: user.entity_id,
      subdomain: user.subdomain,
    };
    // Assign a Token to the user by role_id,branch_id,entity_id
    const AccessToken = jwt.sign(
      {
        UserInfo: user_info,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1m" } //Update Expired time in Production
    );

    const refresh_token = refreshToken(user_info);

    // Set JWT in an HTTP-only cookie
    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, //true for production
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day max
    });

    res.status(200).json({
      accessToken: AccessToken,
      user: {
        auth: true,
        authSource: "google",
        id: user?.user_id,
        name: user?.name,
        email: user?.email,
        roleId: user?.role_id,
        role_name: user?.role_name,
        branchId: user.branch_id,
        branchName: user.branch_name,
        entityId: user.entity_id,
        entityName: user.entity_name,
        subdomain: user.subdomain,
      },
      message: "Google Login success",
    });
  } else {
    res
      .status(500)
      .json({ user: null, message: "Login failed | Not Authenticated" });
  }
});

module.exports = router;
