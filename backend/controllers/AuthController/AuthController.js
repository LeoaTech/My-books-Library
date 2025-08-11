const asyncHanlder = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const bcrypt = require("bcryptjs");
const validator = require("validator");

const send_email = require("../../utiliz/sendEmail");

const db = require("../../config/dbConfig");
const { pool } = require("../../config/dbConfig.js");
const {
  createEntity,
  createBranch,
  createRole,
  createUser,
} = require("../../helpers/user_onboarding.js");
// Generate Access JWT
const generateToken = (data) => {
  //5m in production
  return jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn: "5m" });
};

// Refresh token Generate

const refreshToken = (data) => {
  return jwt.sign({ data }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "3h", //in production 1 day
  });
};

/* Create New User as a Library Owner */

const RegisterUser = asyncHanlder(async (req, res) => {
  const client = await pool.connect();
  console.log(req.body);
  try {
    // Start a transaction
    await client.query("BEGIN");

    // Extract data from request body
    if (!req.body.user) {
      res.status(400);
      throw Error("Invalid Form");
    }

    const {
      fullName,
      email,
      password,
      businessName,
      city,
      country,
      address,
      phone,
      description,
      typeOfBooks,
      hasMultipleBranches,
      deliverIntercity,
    } = req.body.user;
    // Validate input
    if (!fullName || !email || !password || !businessName) {
      res.status(400).json({ message: "Please add required fields" });

      throw new Error("Missing required fields");
    }

    // Step 1: Create an Entity
    const entity = {
      businessName,
      city,
      country,
      address,
      city,
      phone,
      description,
      typeOfBooks,
      hasMultipleBranches,
      deliverIntercity,
    };
    const entityId = await createEntity(client, entity);
    console.log(entityId, "Entity Created");

    // Step 2: Create a default branch as main branch

    const branch = {
      businessName,
      city,
      country,
      address,
      city,
      phone,
      entityId,
    };
    const branchId = await createBranch(client, branch, entityId);
    console.log(branchId, "Branch Created");

    //Step 3: Create a  default Admin Role
    const roleId = await createRole(client, entityId);

    console.log(roleId, "New Role Created for Entity ", entityId);

    // Step 4: Create new user with refernce to branch_id

    // check if user exists in DB
    const userExists = await db.query("SELECT id FROM users Where email = $1", [
      email,
    ]);

    if (userExists?.rowCount > 0) {
      return res.status(400).json({ message: "User already exists" });
      // throw new Error("User already exists");
    }

    // create hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt?.hash(password, salt);

    const userDetails = {
      fullName,
      email,
      hashedPassword,
      city,
      country,
      address,
      phone,
      roleId,
      img_url: "",
    };

    const userId = await createUser(client, userDetails, branchId);
    console.log(userId, "User Created");

    await client.query("COMMIT");

    res.status(201).json({
      message: "User account created successfully",
      data: { entityId, branchId, userId },
    });
  } catch (error) {
    // Rollback transaction
    await client.query("ROLLBACK");
    console.error("Error creating user account:", error);
    res.status(500).json({ error: "Failed to create user account" });
  } finally {
    client.release();
  }
});

// Create New User Account
const SignupUser = asyncHanlder(async (req, res) => {
  const { name, email, password } = req.body;

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

    const checkRole = await db.query(
      "SELECT role_id FROM roles Where name=  $1",
      ["user"]
    );

    // console.log(checkRole?.rows);
    let role;

    if (checkRole?.rowCount > 0) {
      role = checkRole?.rows[0]?.role_id;
    }
    try {
      // check if user exists in DB
      const userExists = await db.query(
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
      const user = await db.query(
        `INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, email, hashedPassword, role]
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
      const userEmail = await db.query(
        `SELECT 
        u.id, u.email,u.name, u.password, u.branch_id, u.role_id,
        b.entity_id , b.name AS branch_name,
        e.name AS entity_name,
        r.name AS role_name
      FROM users u
      JOIN branches b ON u.branch_id = b.id
      JOIN entity e  ON b.entity_id  = e.id
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.email = $1
        `,
        [email]
      );
      let user = userEmail?.rows[0];

      // console.log(user, "Login");

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
      // console.log(user, "Login");

      if (user && matchPassword) {
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
          { expiresIn: "10s" }
        );

        const refresh_token = refreshToken(user_info); //refresh token

    
        // Set the cookie with refresh token
        res.cookie("refreshToken", refresh_token, {
          httpOnly: true,
          sameSite: "strict",
          secure: false, //true for production
          maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day max
        });
        return res.send({
          accessToken: AccessToken,
          user: {
            id: user?.id,
            name: user?.name,
            email: user?.email,
            roleId: user?.role_id,
            role_name: user?.role_name,
            branchId: user.branch_id,
            branchName: user.branch_name,
            entityId: user.entity_id,
            entityName: user.entity_name,
            authSource: "email",
          },
          message: "Login Successfully",
          redirect: `http://localhost:5173/`,
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
      const foundJWToken = await db.query(
        "select * from tokens where token = $1",
        [TokenRefresh]
      );

      // console.log(foundJWToken?.rows[0]);
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
        const dbToken = await db.query(
          `Update tokens set token=$1, expired_at=$2 where user_id= $3 RETURNING *`,
          ["", expired_at, foundJWToken?.rows[0]?.user_id]
        );

        // console.log(dbToken?.rows[0]);
      } catch (error) {
        // console.log(error, "User token Insertion Failed");
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
    const foundJWToken = await db.query(
      "select * from tokens where token = $1",
      [TokenRefresh]
    );

    // Check if user id exists in table with this token user id
    const foundUser = await db.query("select * from users where id =$1", [
      foundJWToken?.rows[0]?.user_id,
    ]);

    // console.log(foundJWToken, "db token found");

    if (!foundJWToken) {
      return res
        .status(401)
        .json({ message: "Invalid Token... User not found" });
    }

    let userData;
    if (foundUser) {
      userData = foundUser?.rows[0];
    }

    // Find role name for Each role_id

    const findRoleName = await db.query(
      "SELECT name FROM roles WHERE role_id=$1",
      [userData?.role_id]
    );

    let role_name;
    if (findRoleName?.rowCount > 0) {
      role_name = findRoleName?.rows[0]?.name;
    } else {
      role_name = "";
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
              role_id: userData?.role_id,
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
            role: userData?.role_id,
            role_name: role_name,
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
    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    let userData = userExists?.rows[0];
    // console.log(userExists?.rows[0], "User Found");

    if (userExists?.rowCount > 0) {
      // Send the Reset Password Email

      const userInfo = {
        id: userData?.id,
        role_id: userData?.role_id,
      };

      let resetToken = generateToken(userInfo);
      // const salt = await bcrypt.genSalt(12);

      // const hash = await bcrypt.hash(resetToken, salt);
      // Store the Token in DB as email Verify Token
      try {
        const userUpdate = await db.query(
          `update users set reset_password_token =$1 where email= $2 Returning *`,
          [resetToken, email]
        );

        if (userUpdate?.rowCount > 0) {
          let data = userUpdate?.rows[0];

          const RESET_EMAIL_TXT = `Please Click the link to Reset your Password 
          
          ${process.env.CLIENT_URL}/forgotpassword/${data?.id}/${resetToken}
          
          
          (Link will expire in 5 minutes)`;

          // console.log(data, "updated user");

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
    const userExists = await db.query(
      "SELECT * FROM users Where id = $1 AND reset_password_token = $2 ",
      [id, token]
    );

    const validateToken = jwt.verify(token, process.env.JWT_SECRET);

    if (userExists?.rowCount > 0 && validateToken) {
      return res.status(201).json({ message: "success" });
    } else {
      const updateResetToken = await db.query(
        "UPDATE users set reset_password_token = $1 Where id = $2 ",
        [token, id]
      );

      // console.log(updateResetToken?.rows[0]);
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

    // console.log(validateToken);

    if (!password) {
      res.status(400);
      throw Error("Please Enter Password");
    }

    const UserExists = await db.query("SELECT * FROM users Where id = $1", [
      id,
    ]);

    // Token is Verified and User Exists with the Id

    if (validateToken && UserExists?.rowCount > 0) {
      // create hash password to save in db
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt?.hash(password, salt);

      // Update User table with new Password;
      try {
        const userUpdate = await db.query(
          `update users set password =$1 where id= $2 Returning *`,
          [hashedPassword, id]
        );

        // Password Updated Successfully
        if (userUpdate?.rowCount > 0) {
          let data = userUpdate?.rows[0];

          try {
            await db.query(
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
  SignupUser,
  RegisterUser,
  LoginUser,
  Logout,
  RefreshToken,
  ForgetPassword,
  VerifyUserAuth,
  ResetPassword,
};
