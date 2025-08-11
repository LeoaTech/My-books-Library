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
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Callback routes for Success and Failure routes for Google Authentication

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: `http://localhost:5173/`, //Redirect to Client Home Page
    failureRedirect: "/auth/google/failure",
  })
  // async (req, res) => {
  //   console.log(req.user,"Req");

  //   // Generate JWT

  //   const user_info = { id: req.user.id, role_id: req.user?.role_id };
  //   const refresh_token = refreshToken(user_info); //refresh token

  //   // Set JWT in an HTTP-only cookie
  //   res.cookie("refreshToken", refresh_token, {
  //     httpOnly: true,
  //     sameSite: "strict",
  //     secure: false, //true for production
  //     maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day max
  //   });

  //   const checkRole = await db.query(
  //     "SELECT name FROM roles Where role_id=  $1",
  //     [req.user?.role_id]
  //   );
  //   let role_name;

  //   if (checkRole?.rowCount > 0) {
  //     role_name = checkRole?.rows[0]?.name;
  //   }
  //   // res.redirect(`${process.env.CLIENT_URL}`);
  //   res.status(200).json({
  //     user: {
  //       email: req.user.email,
  //       name: req.user.name,
  //       role: req.user.role_id,
  //       role_name: role_name,
  //       auth: true,
  //     },
  //     message: "Login success",
  //   });
  // }
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
  console.log(req.user, "user Failed");

  res.redirect("https://localhost:5173/signin");
});

// Successful google login Route

router.get("/auth/login/success", async (req, res) => {
  if (req.user) {

    console.log(req.user, "Google Success Signin")
    // const checkRole = await db.query(
    //   "SELECT name FROM roles Where role_id=  $1",
    //   [req.user?.role_id]
    // );
    // let role_name;

    // if (checkRole?.rowCount > 0) {
    //   role_name = checkRole?.rows[0]?.name;
    // }

    const result = await db.query(
      `
            SELECT 
            u.id, u.email,u.name, u.branch_id, u.role_id,
            b.entity_id , b.name AS branch_name,
            e.name AS entity_name,
            r.name AS role_name
          FROM users u
          JOIN branches b ON u.branch_id = b.id
          JOIN entity e  ON b.entity_id  = e.id
          JOIN roles r ON u.role_id = r.role_id
          WHERE u.id = $1
          `,
      [req.user.id]
    );


    console.log(result.rows[0],"DB User data")
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const user = result.rows[0];

    const user_info = {
      userId: user.id,
      roleId: user.role_id,
      branchId: user.branch_id,
      entityId: user.entity_id,
    };
    // Assign a Token to the user by role_id,branch_id,entity_id
    const AccessToken = jwt.sign(
      {
        UserInfo: user_info,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10s" } //Update Expired time in Production
    );

    // { id: user.id, role_id: user?.role_id };
    const refresh_token = refreshToken(user_info);
    // const user_info = { id: req.user.id, role_id: req.user?.role_id };
    // const refresh_token = refreshToken(user_info); //refresh token

    // Set JWT in an HTTP-only cookie
    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, //true for production
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day max
    });

    res.status(200).json({
      accessToken: AccessToken,
      user: {
        //   email: req.user.email,
        //   name: req.user.name,
        //   role: req.user.role_id,
        //   role_name: role_name,
        auth: true,
        authSource:"google",
        id: user?.id,
        name: user?.name,
        email: user?.email,
        roleId: user?.role_id,
        role_name: user?.role_name,
        branchId: user.branch_id,
        branchName: user.branch_name,
        entityId: user.entity_id,
        entityName: user.entity_name,
      },

      message: "Google Login success",
    });
  } else {
    res.json({ user: null, message: "Login failed | Not Authenticated" });
  }
});

module.exports = router;
