const asyncHanlder = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { Client } = require("pg");
const sendEmails = require("../../utiliz/NodeEmail");
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
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "10m" });
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
        return res
          .status(400)
          .json({ error: "Invalid Credentials" });
      }
    } catch (error) {
      console.log(error, "Signin");
      
      return res
      .status(400)
      .json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    console.log("err", "Sign in API");
    return res.status(400).json({ message: err.message });
  }
});

module.exports = {
  RegisterUser,
  LoginUser,
};
