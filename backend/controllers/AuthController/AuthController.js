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

module.exports = {
  RegisterUser,
};
