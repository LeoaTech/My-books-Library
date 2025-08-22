const asyncHanlder = require("express-async-handler");
const db = require("../../config/dbConfig");

const getAllUsers = asyncHanlder(async (req, res) => {
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
const getLibraryUsers = asyncHanlder(async (req, res) => {
  // console.log(req.user, "Query user credentials");

  const entityId= req?.user?.entityId || req.user?.entity_id;
  // Get all user's belongs to a Library
  const userQuery = `SELECT
    u.id AS user_id,
    u.email,
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

const getUserProfile = asyncHanlder(async (req, res) => {
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
// Update User Profile

const updateUserPrfile = asyncHanlder(async (req, res) => {
  res.status(200).json({ message: "Update user Successfully" });
});

// Update User Role for a Library
const UpdateRoles = asyncHanlder(async (req, res) => {
  const entityId = req.user?.entityId || req.user?.entity_id;
  const userId = req.params.user_id;
  const newRoleID = req.body.newRoleId;

  // console.log(req.params, req.body);
  /* Verify if user_id exists in db for the entity_id */
  const foundUserID = await db.query(`SELECT id from user_entity_roles where user_id= $1 and entity_id =$2`, [
    userId, entityId
  ]);
  let user = foundUserID?.rows[0];

  console.log("found user", user);
  if (!user) {
    return res.status(401).json({ message: "Invalid User, User not Belongs to this Library" });
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

// Delete a User

const DeleteUser = asyncHanlder(async (req, res) => {
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

module.exports = {
  UpdateRoles,
  DeleteUser,
  updateUserPrfile,
  getUserProfile,
  getAllUsers,
  getLibraryUsers,
};
