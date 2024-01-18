const asyncHanlder = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { Client } = require("pg");
const connectionUrl = process.env.CONNECTION_URL;
const send_email = require("../../utiliz/sendEmail");

const client = new Client(connectionUrl);

client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Authentication API connected");
  }
});

// Generate Access JWT
const generateToken = (id) => {
  //5m in production
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1m" });
};

// Refresh token Generate

const refreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "1d", //in production 7 day
  });
};

// Create New User Account
const RegisterUser = asyncHanlder(async (req, res) => {
  const { name, email, password, role } = req.body;

  let userRole = "";
  if (role == undefined) {
    userRole = "user";
  }
  try {
    if (!name || !email || !password) {
      res.status(400);
      throw Error("Please add all required fields");
    }
    // Vaidation of Signup Form fileds
    if (!validator.isEmail(email)) {
      throw Error("Email must be a valid email");
    }
    // if (!validator.isStrongPassword(password)) {
    //   throw Error("Please enter a strong password");
    // }
    try {
      // check if user exists in DB
      const userExists = await client.query(
        "SELECT * FROM users Where email = $1",
        [email]
      );

      if (userExists?.rowCount > 0) {
        return res.status(400).json({ message: "User already exists" });
        // throw new Error("User already exists");
      }

      // create hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt?.hash(password, salt);

      // Save User in DB
      const user = await client.query(
        `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, email, hashedPassword, userRole]
      );

      console.log(user.rowCount, "Inserted user in users Table");
      if (user) {
        return res.status(200).json({
          message: "Success",
        });
      } else {
        return res.status(400).json({ message: "User Registration failed" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Authenticate user Credentials on Logged in
const LoginUser = asyncHanlder(async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }
    try {
      // Verify user email in DB
      const userEmail = await client.query(
        `SELECT * from users where email= $1`,
        [email]
      );
      let user = userEmail?.rows[0];

      if (!user) {
        return res.status(401).json({ message: "Invalid Email" });
        // throw new Error("Invalid Email Address");
      }
      let matchPassword = await bcrypt.compare(password, user?.password);

      if (!matchPassword) {
        return res.status(401).json({ message: "Invalid Password" });
        // throw new Error("Invalid Password");
      }
      // Email and password match

      if (user && matchPassword) {
        // Assign a Token to the user
        const AccessToken = jwt.sign(
          {
            UserInfo: {
              id: user.id,
            },
          },
          process.env.JWT_SECRET,
          { expiresIn: "30s" }
        );

        const refresh_token = refreshToken(user.id); //refresh token

        // Check if user id exists in Tokens table or not
        const isTokenExists = await client.query(
          "SELECT * FROM tokens WHERE user_id=$1",
          [user?.id]
        );
        const expired_at = new Date();
        expired_at?.setDate(expired_at.getDate() + 1);
        if (isTokenExists?.rowCount > 0) {
          // Update Token info on sign in
          try {
            // create user
            const dbToken = await client.query(
              `Update tokens set token=$1, expired_at=$2 WHERE user_id=$3 RETURNING *`,
              [refresh_token, expired_at, user?.id]
            );
          } catch (error) {
            console.log(error, "User token update in db error");
          }
        } else {
          try {
            // create user refresh token in db on first login
            const dbToken = await client.query(
              `INSERT INTO tokens ( user_id, token, expired_at) VALUES ($1, $2, $3) RETURNING *`,
              [user?.id, refresh_token, expired_at]
            );
          } catch (error) {
            console.log(error, "User token insert in db error");
          }
        }

        // Set the cookie with refresh token
        res.cookie("refreshToken", refresh_token, {
          httpOnly: true,
          sameSite: "strict",
          secure: false,
          maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day max
        });
        return res.send({
          AccessToken,
          user: {
            name: user?.name,
            email: user?.email,
            role: user?.role,
          },
          message: "success",
        });
      } else {
        return res.status(400).json({ error: "Invalid Credentials" });
      }
    } catch (error) {
      console.log(error, "Signin");

      return res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    console.log("err", "Sign in API");
    return res.status(400).json({ message: err.message });
  }
});

// User Logout

const Logout = asyncHanlder(async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies["refreshToken"]) {
      return res.status(401).json({ message: "unauthorized Cookie not found" });
    }
    if (cookies["refreshToken"]) {
      const TokenRefresh = cookies["refreshToken"];

      // Check if refresh token from cookie is same that we saved in db
      const foundJWToken = await client.query(
        "select * from tokens where token = $1",
        [TokenRefresh]
      );

      console.log(foundJWToken?.rows[0]);
      if (!foundJWToken) {
        res.clearCookie("refreshToken", {
          httpOnly: true,
          sameSite: "none", //"strict",
          secure: false,
        });
        return res.status(204).json({ message: "Cookie deleted" });
      }

      let expired_at = new Date();
      // Delete the token from the db
      try {
        // Update Tokens table to remove the token data
        const dbToken = await client.query(
          `Update tokens set token=$1, expired_at=$2 where user_id= $3 RETURNING *`,
          ["", expired_at, foundJWToken?.rows[0]?.user_id]
        );

        console.log(dbToken?.rows[0]);
      } catch (error) {
        console.log(error, "User token insert in db error");
        return res.sendStatus(401);
      }
      // in production add the secure flag true with cookie

      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "None", // "strict",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, //1 day
      });
      res.clearCookie("refreshToken", {
        path: "/",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
      });

      res.send({ message: "Logged out" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: "Credentials not Found to Logout" });
  }
});

// Get refersh token
const RefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies["refreshToken"]) {
      return res.status(401).json({ message: "Unauthorized Access Denied" });
    }

    const TokenRefresh = cookies["refreshToken"];

    // Check if refresh token from cookie is same that we saved in db
    const foundJWToken = await client.query(
      "select * from tokens where token = $1",
      [TokenRefresh]
    );

    // Check if user id exists in table with this token user id
    const foundUser = await client.query("select * from users where id =$1", [
      foundJWToken?.rows[0]?.user_id,
    ]);

    console.log(foundJWToken, "db token found");

    if (!foundJWToken) {
      return res
        .status(401)
        .json({ message: "Invalid Token... User not found" });
    }

    let userData;
    if (foundUser) {
      userData = foundUser?.rows[0];
    }
    // Verify Refresh token to generate new access token
    jwt.verify(
      TokenRefresh,
      process.env.JWT_REFRESH_SECRET,
      asyncHanlder(async (err, decoded) => {
        if (err)
          return res.json({
            error: err,
            message: "Forbidden Access.. Invalid Token ",
          });

        // If verified the http only cookie, grant new access token
        const accessToken = jwt.sign(
          {
            UserInfo: {
              id: foundJWToken?.rows[0]?.id,
            },
          },
          process.env.JWT_SECRET,
          { expiresIn: "40s" } //production for 5 min
        );

        res.send({
          accessToken,
          user: {
            name: userData?.name,
            email: userData?.email,
            role: userData?.role,
          },
          message: "Success to Authorized",
        });
      })
    );
  } catch (error) {
    console.log(error);
    return res.json({ message: "UnAuthorized" });
  }
};

// Forget And Reset Password

// Forget Password
const ForgetPassword = asyncHanlder(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(401).json({ message: "Enter Email Address" });
  }

  try {
    // check if user email exists
    const userExists = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    let userData = userExists?.rows[0];
    console.log(userExists?.rows[0], "User Found");

    if (userExists?.rowCount > 0) {
      // Send the Reset Password Email

      let resetToken = generateToken(userData?.id);
      // const salt = await bcrypt.genSalt(12);

      // const hash = await bcrypt.hash(resetToken, salt);
      // Store the Token in DB as email Verify Token
      try {
        const userUpdate = await client.query(
          `update users set reset_password_token =$1 where email= $2 Returning *`,
          [resetToken, email]
        );

        if (userUpdate?.rowCount > 0) {
          let data = userUpdate?.rows[0];

          const RESET_EMAIL_TXT = `Please Click the link to Reset your Password 
          
          ${process.env.CLIENT_URL}/forgotpassword/${data?.id}/${resetToken}
          
          
          (Link will expire in 5 minutes)`;

          console.log(data, "updated user");

          // send Password Reset Email
          try {
            await send_email(email, "Reset Password ✔", RESET_EMAIL_TXT);

            res.status(200).json({ message: "Check your  email " });
          } catch (error) {
            console.log(error, "mail not sent");
          }
        }
      } catch (e) {
        console.log(e.message, "Token not updated");
        res.status(401).json({ message: "Invalid Email Id" });
      }
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Verify user Before Resetting Password and validate token expiration

const VerifyUserAuth = asyncHanlder(async (req, res) => {
  const { id, token } = req.params;

  try {
    // check if user exists with token and user_id
    const userExists = await client.query(
      "SELECT * FROM users Where id = $1 AND reset_password_token = $2 ",
      [id, token]
    );

    const validateToken = jwt.verify(token, process.env.JWT_SECRET);

    if (userExists?.rowCount > 0 && validateToken) {
      return res.status(201).json({ message: "success" });
    } else {
      const updateResetToken = await client.query(
        "UPDATE users set reset_password_token = $1 Where id = $2 ",
        [token, id]
      );

      console.log(updateResetToken?.rows[0]);
      return res.redirect(`${process.env.CLIENT_URL}/expired-link`);
    }
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
});

// Reset Password on Forget Passowrd
const ResetPassword = asyncHanlder(async (req, res) => {
  // Get Token and ID from Params to Validate Reset password request
  const { id, token } = req.params;
  const { password, confirm_password } = req.body; // Password inputs

  try {
    // Validate Token
    const validateToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log(validateToken);

    if (!password) {
      res.status(400);
      throw Error("Please Enter Password");
    }

    const UserExists = await client.query("SELECT * FROM users Where id = $1", [
      id,
    ]);

    // Token is Verified and User Exists with the Id

    if (validateToken && UserExists?.rowCount > 0) {
      // create hash password to save in db
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt?.hash(password, salt);

      // Update User table with new Password;
      try {
        const userUpdate = await client.query(
          `update users set password =$1 where id= $2 Returning *`,
          [hashedPassword, id]
        );

        // Password Updated Successfully
        if (userUpdate?.rowCount > 0) {
          let data = userUpdate?.rows[0];

          try {
            await client.query(
              `update users set reset_password_token =$1 where id= $2 Returning *`,
              ["", id]
            );
          } catch (err) {
            console.log(err);
          }
          res.status(201).json({ message: "Password updated Successfully" });
        } else {
          res.status(401).json({ message: "Password not Updated" });
        }
      } catch (error) {
        res.status(401).json({ message: "Password not Updated" });
      }
    } else {
      return res.redirect(`${process.env.CLIENT_URL}/expired-link`);

      // res
      //   .status(401)
      //   .json({ message: "Invalid Token, Please genrate new Link " });
    }
  } catch (error) {
    console.log(error, "Token expired error");
    // res.status(401).json({ message: "Invalid Email Id" });
    return res.redirect(`${process.env.CLIENT_URL}/expired-link`);
  }
});

module.exports = {
  RegisterUser,
  LoginUser,
  Logout,
  RefreshToken,
  ForgetPassword,
  VerifyUserAuth,
  ResetPassword,
};
