const asyncHandler = require("express-async-handler");
const db = require("../../config/dbConfig");
const { pool } = require("../../config/dbConfig.js");
const { createUser } = require("../../helpers/user_onboarding.js");
const bcrypt = require("bcryptjs");

const getAllUsers = asyncHandler(async (req, res) => {
  // console.log(req.user, "Query user");
  const userQuery = `SELECT
    u.id AS user_id,
    u.email,
    uer.role_id,
    uer.entity_id,
    uer.branch_id,
    r.name AS role_name,
    u.name AS name,
    ARRAY_AGG(p.name) AS permissions
FROM
    public.users u
JOIN
    public.user_entity_roles uer ON u.id = uer.user_id
JOIN
    public.role_permissions rp ON uer.role_id = rp.role_id
JOIN
    public.roles r ON r.role_id = uer.role_id
JOIN
    public.permissions p ON rp.permission_id = p.permission_id
GROUP BY
    u.id, u.email, uer.role_id, uer.entity_id, uer.branch_id, r.name, u.name;
`;

  const userExists = await db.query(userQuery);

  res.status(200).json({
    data: userExists?.rows,
    message: "All users routes are available",
  });
});

// Get a Specific Entity or a Library users only
const getLibraryUsers = asyncHandler(async (req, res) => {

  const entityId = req?.user?.entityId || req.user?.entity_id;
  // Get all user's belongs to a Library
  const userQuery = `SELECT
    u.id AS user_id,
    u.email,
    u.address,
    u.city,
    u.country,
    u.phone,
    uer.role_id,
    uer.entity_id,
    uer.branch_id,
    r.name AS role_name,
    u.name AS name
FROM
    public.users u
JOIN
    public.user_entity_roles uer ON u.id = uer.user_id
JOIN
    public.roles r ON r.role_id = uer.role_id
WHERE
    uer.entity_id = $1
GROUP BY
    u.id, u.email, uer.role_id, uer.entity_id, uer.branch_id, r.name, u.name `;

  const userExists = await db.query(userQuery, [entityId]);

  res.status(200).json({
    data: userExists?.rows,
    message: "Successfully fetched a library users ",
  });
});

// Get user Profile Info

const getUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const getUserProfile = `SELECT
  u.id AS user_id,
  u.email,
  u.role_id,
  u.phone,
  u.name,
  u.address,
  ARRAY_AGG(p.name) AS permissions
FROM
  public.users u
JOIN
  public.role_permissions rp ON u.role_id = rp.role_id
JOIN
  public.permissions p ON rp.permission_id = p.permission_id
WHERE
  u.id = $1
GROUP BY
  u.id, u.email, u.role_id;`;
  const userExists = await db.query(getUserProfile, [userId]);

  res.status(200).json({
    data: userExists?.rows[0],
    message: "All users routes are available",
  });
});

// Get User Profile Details

const userDetails = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  const getUserProfile = `SELECT
  u.id AS user_id,
  u.email,
  u.phone,
  u.name,
  u.address,
  u.city,
  u.country
FROM
  public.users u
WHERE
  u.id = $1`;
  const userExists = await db.query(getUserProfile, [user_id]);

  res.status(200).json({
    data: userExists?.rows[0],
    message: "All users routes are available",
  });
});

// Update User Profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, address, city, country, password } = req.body;
  const userId = req?.user?.user_id || req?.user?.userId;

  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      let hashedPassword;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
      }

      let updateFields = [];
      let values = [];
      let paramCount = 1;

      if (name) {
        updateFields.push(`name = $${paramCount}`);
        values.push(name);
        paramCount++;
      }
      if (phone) {
        updateFields.push(`phone = $${paramCount}`);
        values.push(phone);
        paramCount++;
      }
      if (address) {
        updateFields.push(`address = $${paramCount}`);
        values.push(address);
        paramCount++;
      }
      if (city) {
        updateFields.push(`city = $${paramCount}`);
        values.push(city);
        paramCount++;
      }
      if (country) {
        updateFields.push(`country = $${paramCount}`);
        values.push(country);
        paramCount++;
      }
      if (hashedPassword) {
        updateFields.push(`password = $${paramCount}`);
        values.push(hashedPassword);
        paramCount++;
      }

      if (email) {
        updateFields.push(`email = $${paramCount}`);
        values.push(email);
        paramCount++;
      }

      if (updateFields.length === 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "No fields to update" });
      }

      values.push(userId);
      const updateQuery = `
        UPDATE users 
        SET ${updateFields.join(", ")} 
        WHERE id = $${paramCount} 
        RETURNING id, name, email, phone, address, city, country
      `;

      const result = await client.query(updateQuery, values);

      await client.query("COMMIT");

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User profile updated successfully",
        user: result.rows[0],
      });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
});

// Update User Role for a Library
const UpdateRoles = asyncHandler(async (req, res) => {
  const entityId = req.user?.entityId || req.user?.entity_id;
  const userId = req.params.user_id;
  const newRoleID = req.body.newRoleId;

  const foundUserID = await db.query(
    `SELECT id from user_entity_roles where user_id= $1 and entity_id =$2`,
    [userId, entityId],
  );
  let user = foundUserID?.rows[0];

  if (!user) {
    return res
      .status(401)
      .json({ message: "Invalid User, User not Belongs to this Library" });
    // throw new Error("Invalid Email Address");
  }

  try {
    // Update user role in the library
    const updateQuery = await db.query(
      `UPDATE user_entity_roles SET role_id = $1 WHERE user_id = $2 and entity_id = $3 RETURNING *`,
      [newRoleID, userId, entityId],
    );

    return res.status(201).json({ message: "Updated Role for ", userId });
  } catch (error) {
    // console.log(error, "User Role update Error in db");
    res.status(500).json({
      message: error.message || "Error Updating User Role",
    });
  }
});

// Create a New User with a specific Role (From Admin Dashboard);
const CreateUser = asyncHandler(async (req, res) => {
  const client = await pool.connect();

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw Error("Please add all required fields");
  }
  try {
    await client.query("BEGIN");

    let entityId = req?.user?.entityId || req?.user?.entity_id;
    let branchId = req?.user?.branchId || req?.user?.entity_id;
    let roleId = req?.body?.role_id || req?.user?.roleId;

    roleId = Number(roleId);
    // check if user with email exists in DB
    const userExists = await db.query("SELECT id FROM users Where email = $1", [
      email,
    ]);

    let userId;
    if (userExists?.rowCount == 0) {
      // Create as a  New User
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt?.hash(password, salt);

      const userDetails = {
        fullName: name,
        email,
        hashedPassword,
        city: req.body?.city || "",
        country: req.body?.country || "",
        address: req.body?.address || "",
        phone: req.body?.phone || "",
        img_url: "",
      };

      const userResult = await createUser(client, userDetails);
      userId = userResult.id;
    } else {
      userId = userExists?.rows[0]?.id;
    }
    // Add the user Id's associated entity, role_id and branch_id in the user_entity_roles table
    const userRole = await client.query(
      "INSERT INTO user_entity_roles (user_id, entity_id, branch_id, role_id) VALUES ($1, $2, $3, $4) Returning *",
      [userId, entityId, branchId, roleId],
    );
    await client.query("COMMIT");
    res.status(200).json({
      data: userRole.rows[0],
      message: "Inside the User creation  API",
    });
  } catch (error) {
    await client.query("ROLLBACK");

    return res
      .status(500)
      .json({ message: error.message || "Failed to create user" });
  } finally {
    client.release();
  }
});

// Delete a User

const DeleteUser = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  try {
    const deleteUserQuery = await db.query(`DELETE FROM users WHERE id=$1`, [
      user_id,
    ]);


    res.status(200).json({ message: "Delete. user Successfully" });
  } catch (error) {
    // console.log(error);
        res.status(500).json({
      message: error.message || "Failed to delete user",
    });
  }
});

// Register Device token to send push notifications
const registerDeviceToken = asyncHandler(async (req, res) => {

  try {
    const { fcmToken, userId } = req.body;

    if (userId !== req.userId) {
      return res.status(403).json({ error: "Unauthorized User" });
    }
    const query = `
        INSERT INTO user_fcm_tokens (user_id, token) 
        VALUES ($1, $2) 
        ON CONFLICT (user_id, token) DO NOTHING
    `;
    await db.query(query, [userId, fcmToken]);
    res.json({ message: "Token added successfully for user !", userId });
  } catch (err) {
    console.error("Update token error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = {
  UpdateRoles,
  userDetails,
  DeleteUser,
  getUserProfile,
  getAllUsers,
  getLibraryUsers,
  CreateUser,
  registerDeviceToken,
  updateUserProfile,
};
