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

  // console.log(userExists?.rows, "User Found");
  res.status(200).json({
    data: userExists?.rows,
    message: "All users routes are available",
  });
});

// Get a Specific Entity or a Library users only
const getLibraryUsers = asyncHandler(async (req, res) => {
  // console.log(req.user, "Query user credentials");

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

  // console.log(userExists?.rows, "User Found");
  res.status(200).json({
    data: userExists?.rows[0],
    message: "All users routes are available",
  });
});



// Get User Profile Details

const userDetails = asyncHandler(async (req, res) => {
  console.log(req.params, "User ID",req.query);
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

  console.log(userExists?.rows, "User Found");
  res.status(200).json({
    data: userExists?.rows[0],
    message: "All users routes are available",
  });
});


// Update User Role for a Library
const UpdateRoles = asyncHandler(async (req, res) => {
  const entityId = req.user?.entityId || req.user?.entity_id;
  const userId = req.params.user_id;
  const newRoleID = req.body.newRoleId;

  const foundUserID = await db.query(
    `SELECT id from user_entity_roles where user_id= $1 and entity_id =$2`,
    [userId, entityId]
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
      [newRoleID, userId, entityId]
    );

    // console.log(updateQuery?.rows[0],"Updated Role");
    return res.status(201).json({ message: "Updated Role for ", userId });
  } catch (error) {
    console.log(error, "User Role update Error in db");
  }
});

// Create a New User with a specific Role (From Admin Dashboard);
const CreateUser = asyncHandler(async (req, res) => {
  // console.log(req.body, "Payload");
  const client = await pool.connect();

  // console.log(req.user, "User ");
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
      [userId, entityId, branchId, roleId]
    );
    await client.query("COMMIT");
    res.status(200).json({
      data: userRole.rows[0],
      message: "Inside the User creation  API",
    });
  } catch (error) {
    console.log(error);
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
  console.log(req.params);

  try {
    const deleteUserQuery = await db.query(`DELETE FROM users WHERE id=$1`, [
      user_id,
    ]);

    console.log(deleteUserQuery?.rowCount);

    res.status(200).json({ message: "Delete. user Successfully" });
  } catch (error) {
    console.log(error);
  }
});

const registerDeviceToken = asyncHandler(async (req, res) => {
  // console.log(req.body, "payload from client");

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
    res.json({ message: "Token added successfully for user !",userId });
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
};
