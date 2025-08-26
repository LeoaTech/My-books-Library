const asyncHanlder = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const bcrypt = require("bcryptjs");
const validator = require("validator");

const send_email = require("../../utiliz/sendEmail.js");

const db = require("../../config/dbConfig.js");
const { pool } = require("../../config/dbConfig.js");
const {
  createEntity,
  createBranch,
  createRole,
  createUser,
  addPermissions,
  checkSubdomain,
  generateSubdomain,
  getEntity,
  getBranch,
  createDummyVendor,
  createDefaultRoles,
} = require("../../helpers/user_onboarding.js");
// Generate Access JWT
const generateToken = (data) => {
  //5m in production
  return jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn: "5m" });
};

// Refresh token Generate

const refreshToken = (data) => {
  return jwt.sign({ data }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "3h", //in production 7 day
  });
};

/* Create New User as a Library Owner */

const RegisterUser = asyncHanlder(async (req, res) => {
  const client = await pool.connect();
  // console.log(req.body);
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

    // Check if user already exists
    let userResult = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    let userId;

    if (userResult.rows.length === 0) {
      // create hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt?.hash(password, salt);

      // Create new user
      const userDetails = {
        fullName,
        email,
        hashedPassword,
        city,
        country,
        address,
        phone,
        img_url: "",
      };

      const userResult = await createUser(client, userDetails);
      userId = userResult.id;
    } else {
      userId = userResult.rows[0].id;
    }
    console.log(userId, "User Created");

    // Check if user ID with the email already has an "owner" role in any other library(entity_id)
    const ownerCheck = await pool.query(
      `
      SELECT uer.user_id
      FROM user_entity_roles uer
      JOIN roles r ON uer.role_id = r.role_id
      WHERE uer.user_id = $1 AND r.name = 'owner'
      `,
      [userId]
    );

    /* user is already an owner of a Library */
    if (ownerCheck.rows.length > 0) {
      await client.query("ROLLBACK"); // Stop Library Registeration Process
      return res.status(403).json({
        error:
          "Failed to Create Library, User's email already associates to a Library as an owner",
      });
    }
    /*Continue with Library Registration Steps  */

    // Generate a subdomain from the Business name
    const subdomain = generateSubdomain(businessName);

    console.log(subdomain, "subdomain Created");

    // make sure the subdomain for each entity_id is unique

    const uniqueSubdomain = await checkSubdomain(client, subdomain);
    console.log(uniqueSubdomain, "Refine - to add Unique subdomain");

    // Step 1: Create an Entity
    const entityData = {
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
      uniqueSubdomain,
    };
    const entity = await createEntity(client, entityData);
    console.log(entity.id, "New Entity Created");

    // Step 2: Create a default branch as main branch

    const branchData = {
      businessName: businessName + "(main)",
      city,
      country,
      address,
      city,
      phone,
      entityId: entity.id,
    };
    const branch = await createBranch(client, branchData, entity.id);
    console.log(branch.id, "Branch Created");

    //Step 3: Create  default Roles for the Library (owner,vendor and customer)
    const roles = await createDefaultRoles(client, entity.id);

    console.log(roles, "New Role Created for Entity ", entity.id);

    // Get the owner role_id from roles list
    let ownerRole = roles.find((role) => role.name == "owner");
    // Add permissions => Allow all permissions to the `owner` role
    const roleAdded = await addPermissions(client, ownerRole.role_id);
    console.log(roleAdded, "Roles Added");

     // Create a Dummy vendor
    let vendorRole = roles.find((role) => role.name == "vendor");
    
    // Create dummy vendor_id for the Library

    let vendorId = await createDummyVendor(client, entity, vendorRole.role_id);

    console.log(vendorId, "Dummy Vendor Created");
    

    // Step 4: Create new user associated branch_id, role_id, entity_id for user_id

    // check if user exists in DB
    const userRole = await client.query(
      "INSERT INTO user_entity_roles (user_id, entity_id, branch_id, role_id) VALUES ($1, $2, $3, $4)",
      [userId, entity.id, branch.id, ownerRole.role_id]
    );

    console.log(userRole.rows, "User Entity Role created");

    await client.query("COMMIT");

    res.status(201).json({
      message: "Library Created successfully",
      user: {
        id: userId,
        email,
        name: fullName,
        entityId: entity.id,
        entityName: entity.name,
        subdomain: entity.subdomain,
        branchId: branch.id,
        branchName: branch.name,
        roleId: ownerRole.role_id,
        role_name: ownerRole.name,
      },
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

/* Login as an Owner  - other role_id users can't get into this */

const LoginUser = asyncHanlder(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  try {
    // Verify user
    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = userResult.rows[0];
    // const isValidPassword = await bcrypt.compare(password, user.password);
    // if (!isValidPassword) {
    //   return res.status(401).json({ error: "Invalid email or password" });
    // }
    // Verify user email in DB
    const associatedEntities = await db.query(
      `
      SELECT
        uer.user_id, uer.entity_id, uer.branch_id, uer.role_id,
        e.name AS entity_name, e.subdomain,
        b.name AS branch_name,
        r.name AS role_name,
        u.name, u.password, u.email
      FROM user_entity_roles uer
      JOIN entity e ON uer.entity_id = e.id
      JOIN branches b ON uer.branch_id = b.id
      JOIN users u ON uer.user_id = u.id
      JOIN roles r ON uer.role_id = r.role_id
      WHERE uer.user_id = $1
      `,
      [user.id]
    );

    // console.log(associatedEntities, "Login");

    if (associatedEntities.rows.length == 0) {
      return res.status(401).json({ message: "Invalid User Credentials" });
      // throw new Error("Invalid Email Address");
    }

    console.log(associatedEntities.rows, "Association for email ID");

    // Check if it has a role of owner
    const ownerAssociation = associatedEntities.rows?.find(
      (user) => user.role_name == "owner"
    );

    console.log(ownerAssociation, "Owner Association");

    // If the user credentials
    if (!ownerAssociation) {
      return res
        .status(401)
        .json({
          error: "Invalid Credentials. Please Login from your domain Library",
        });
    }
    if (!ownerAssociation.password) {
      return res.status(401).json({
        error: "No password set for this Library (use Google OAuth?)",
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      ownerAssociation.password
    );
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ error: "Invalid password for this Library" });
    }

    if (ownerAssociation && isValidPassword) {
      const user_info = {
        userId: ownerAssociation.user_id,
        roleId: ownerAssociation.role_id,
        branchId: ownerAssociation.branch_id,
        entityId: ownerAssociation.entity_id,
        subdomain: ownerAssociation.subdomain,
      };
      // Assign a Token to the user by role_id,branch_id,entity_id
      const AccessToken = jwt.sign(
        {
          UserInfo: user_info,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1m" }
      );

      const refresh_token = refreshToken(user_info); //refresh token

      // Set the cookie with refresh token
      res.cookie("refreshToken", refresh_token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, //true for production
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day max
      });
      res.json({
        accessToken: AccessToken,
        user: {
          id: ownerAssociation?.user_id,
          name: ownerAssociation?.name,
          email: ownerAssociation?.email,
          authSource: "email",
          roleId: ownerAssociation?.role_id,
          role_name: ownerAssociation?.role_name,
          branchId: ownerAssociation.branch_id,
          branchName: ownerAssociation.branch_name,
          entityId: ownerAssociation.entity_id,
          entityName: ownerAssociation.entity_name,
          authSource: "email",
          subdomain: ownerAssociation?.subdomain,
        },
        message: "Login Successfully",
        redirect: `http://localhost:5173'/${ownerAssociation?.subdomain}`,
      });
      // res.status(200).json({
      //   message: "Login successful, select a Library",
      //   user: { id: user.id, email },
      //   LibraryAccounts: associatedEntities?.rows?.map((row) => ({
      //     entityId: row.entity_id,
      //     entityName: row.entity_name,
      //     subdomain: row.subdomain,
      //     branchId: row.branch_id,
      //     branchName: row.branch_name,
      //     roleId: row.role_id,
      //     role_name: row.role_name,
      //   })),
      // });
    }
  } catch (error) {
    console.log(error, "Signin");

    return res.status(400).json({ error: "Invalid Credentials" });
  }
});

// Select an account to sign in

const SelectAccount = asyncHanlder(async (req, res) => {
  console.log(req.body, "Select an Account");

  const { userId, entityId, branchId, roleId, password } = req.body;
  if (!userId || !entityId || !branchId || !roleId) {
    return res.status(400).json({
      error:
        "User ID, entity ID, branch ID, role ID, and password are required",
    });
  }

  try {
    const associationResult = await db.query(
      `SELECT 
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
      [userId, entityId, branchId, roleId]
    );

    console.log(associationResult.rows[0], "User Result on Select");

    if (associationResult.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "Invalid library, branch, or role selection" });
    }

    const association = associationResult.rows[0];
    console.log(association, "Association");

    if (!association.password) {
      return res
        .status(401)
        .json({ error: "No password set for this entity (use Google OAuth?)" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      association.password
    );
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ error: "Invalid password for this Library" });
    }

    const user_info = {
      userId: userId,
      roleId: roleId,
      branchId: branchId,
      entityId: entityId,
      subdomain: association.subdomain,
    };

    // console.log(user_info, "User info for token");

    // Assign a Token to the user by role_id,branch_id,entity_id
    const AccessToken = jwt.sign(
      {
        UserInfo: user_info,
      },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    const refresh_token = refreshToken(user_info); //refresh token
    // console.log(refresh_token, "Token");

    // Set the cookie with refresh token
    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, //true for production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day max
      domain: ".localhost",
    });
    res.json({
      accessToken: AccessToken,
      user: {
        id: association?.user_id,
        name: association?.name,
        email: association?.email,
        authSource: "email",
        roleId: association?.role_id,
        role_name: association?.role_name,
        branchId: association.branch_id,
        branchName: association.branch_name,
        entityId: association.entity_id,
        entityName: association.entity_name,
        authSource: "email",
        subdomain: association?.subdomain,
      },
      message: "Login Successfully",
      redirect: `http://localhost:5173'/${association?.subdomain}`,
    });
  } catch (error) {
    console.error("Error selecting library:", error);
    res.status(500).json({ error: "Failed to select a library account" });
  }
});

// Sign up to Join a Library from library domain (usign email and password)

// Create New User Account
const SignupUser = asyncHanlder(async (req, res) => {
  const client = await pool.connect();

  const { name, email, password, subdomain } = req.body;

  if (!subdomain) {
    return res.status(400).json({
      message: `No Domain is provided `,
    });
  }
  console.log(req.body, "Domain Signup Form");

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
    await client.query("BEGIN");

    const entityId = await getEntity(db, subdomain);

    // console.log("Step 1: ", entityId, " Entity Founded");

    const branchId = await getBranch(db, entityId);

    // console.log("Step 2: ", branchId, "Branch Founded");

    const role = await createRole(client, entityId, "customer");

    // console.log("Step 3: ", role.role_id, " role ID created");

    // check if user with email exists in DB
    const userExists = await db.query("SELECT id FROM users Where email = $1", [
      email,
    ]);

    // console.log("Step 4: ", userExists, "user Founded");
    let userId;
    if (userExists?.rowCount == 0) {
      // Create as a  New User
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt?.hash(password, salt);

      const userDetails = {
        fullName: name,
        email,
        hashedPassword,
        city: "",
        country: "",
        address: "",
        phone: "",
        img_url: "",
      };

      const userResult = await createUser(client, userDetails);
      userId = userResult.id;
    } else {
      userId = userExists?.rows[0]?.id;
    }
    // console.log("Step 5: ", userId, " add user email with new branch ");
    // Add the user Id's associated entity, role_id and branch_id in the user_entity_roles table
    const userRole = await client.query(
      "INSERT INTO user_entity_roles (user_id, entity_id, branch_id, role_id) VALUES ($1, $2, $3, $4)",
      [userId, entityId, branchId, role.role_id]
    );

    // console.log("Step 6: ",userRole.rows, "User Entity Role created");
    await client.query("COMMIT");

    return res.status(200).json({
      message:
        "Congratulations, you signed up successfully, Please Login to your account",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: error.message || "Failed to signup user" });
  } finally {
    client.release();
  }
});

// Sign in to a Library Domain (using email and password)

// Sign in from a Library Domain
//!Warning  => Don't touch this
const SigninUser = asyncHanlder(async (req, res) => {
  const { email, password, subdomain } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  try {
    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const userId = userResult.rows[0].id;

    // If sign in request coming from a specific library domain
    if (subdomain) {
      // Get Subdomain entity_id;

      const entityId = await getEntity(db, subdomain);

      console.log("Step 1: ", entityId, " Entity Founded");

      const associationResult = await db.query(
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
      WHERE uer.user_id = $1 AND uer.entity_id =$2
      `,
        [userId, entityId]
      );
      let user = associationResult?.rows[0]; //
      if (!user) {
        return res.status(401).json({
          message: `Invalid Email, This email not belongs to ${subdomain} domain`,
        });
        // throw new Error("Invalid Email Address");
      }

      let matchPassword = await bcrypt.compare(password, user?.password);

      if (!matchPassword) {
        return res.status(401).json({
          message:
            "Password for this Email is not matched. Please check your login credentials with domain",
        });
        // throw new Error("Invalid Password");
      }
      // Email and password match
      console.log(user, "Login");

      if (user && matchPassword) {
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
          { expiresIn: "1m" }
        );

        const refresh_token = refreshToken(user_info); //refresh token

        // Set the cookie with refresh token
        res.cookie("refreshToken", refresh_token, {
          httpOnly: true,
          sameSite: "lax",
          secure: false, //true for production
          maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day max
        });
        res.json({
          accessToken: AccessToken,
          user: {
            id: user?.id,
            name: user?.name,
            email: user?.email,
            authSource: "email",
            roleId: user?.role_id,
            role_name: user?.role_name,
            branchId: user.branch_id,
            branchName: user.branch_name,
            entityId: user.entity_id,
            entityName: user.entity_name,
            authSource: "email",
            subdomain: user?.subdomain,
          },
          message: "Login Successfully",
          redirect: `http://localhost:5173/${user.subdomain}`,
        });
      }
    } else {
      return res.status(400).json({ error: "Subdomain is not found" });
    }
  } catch (error) {
    console.log(error, "Signin Failed");

    res.status(400).json({ error: "Invalid Credentials" });
  }
});
// User Logout

const Logout = asyncHanlder(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies["refreshToken"]) {
    return res.status(401).json({ message: "unauthorized Cookie not found" });
  }
  try {
    if (cookies["refreshToken"]) {
      const TokenRefresh = cookies["refreshToken"];

      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "lax", // "strict",
        secure: false, //true,
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
  const cookies = req.cookies;
  if (!cookies["refreshToken"]) {
    return res.status(401).json({ message: "Unauthorized Access Denied" });
  }

  try {
    const TokenRefresh = cookies["refreshToken"];

    // Verify Refresh token to generate new access token
    jwt.verify(
      TokenRefresh,
      process.env.JWT_REFRESH_SECRET,
      asyncHanlder(async (err, decoded) => {
        if (err) {
          return res.status(401).json({
            error: err,
            message: "Forbidden Access.. Invalid Token ",
          });
        }
        // console.log(decoded, "Decoded login cred");

        const result = await db.query(
          `SELECT 
        uer.user_id, uer.entity_id, uer.branch_id, uer.role_id,
        e.name AS entity_name, e.subdomain,
        b.name AS branch_name,
        r.name AS role_name,
        u.email, u.name
      FROM user_entity_roles uer
      JOIN entity e ON uer.entity_id = e.id
      JOIN branches b ON uer.branch_id = b.id
      JOIN roles r ON uer.role_id = r.role_id
      JOIN users u ON uer.user_id = u.id
      WHERE uer.user_id = $1 AND uer.entity_id = $2
      `,
          [decoded?.data?.userId, decoded?.data?.entityId]
        );

        // console.log(result.rows[0], "Refresh Result");

        if (result.rows.length === 0) {
          return res.status(401).json({ error: "Invalid refresh token" });
        }

        const user = result.rows[0];

        // console.log(user, "refresh");

        const user_info = {
          userId: user.user_id,
          roleId: user.role_id,
          branchId: user.branch_id,
          entityId: user.entity_id,
          subdomain: user.subdomain,
        };
        // If verified the http only cookie, grant new access token
        const accessToken = jwt.sign(
          {
            UserInfo: user_info,
          },
          process.env.JWT_SECRET,
          { expiresIn: "5m" } //production for 1h
        );

        res.send({
          accessToken,
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
            subdomain: user.subdomain,
          },
          message: "Token Refreshed Successfully",
        });
      })
    );
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ message: "UnAuthorized! Refresh Token is Invalid" });
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
  SigninUser,
  SignupUser,
  SelectAccount,
};
