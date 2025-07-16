const asyncHanlder = require("express-async-handler");
const db = require("../../config/dbConfig");

const getAllUsers = asyncHanlder(async (req, res) => {
  const userQuery = `SELECT
u.id AS user_id,
u.email,
u.role_id,
r.name AS role_name,
u.name AS name,
ARRAY_AGG(p.name) AS permissions
FROM
public.users u
JOIN
public.role_permissions rp ON u.role_id = rp.role_id
JOIN
public.roles r ON r.role_id = u.role_id
JOIN
public.permissions p ON rp.permission_id = p.permission_id
GROUP BY
u.id, u.email, u.role_id, r.name ; `;

  const userExists = await db.query(userQuery);

  // console.log(userExists?.rows, "User Found");
  res.status(200).json({
    data: userExists?.rows,
    message: "All users routes are available",
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

// Update Role for Active User
const UpdateRoles = asyncHanlder(async (req, res) => {
  const userId = req.params.user_id;
  const newRoleID = req.body.newRoleId;

  console.log(req.params, req.body);

  const foundUserID = await db.query(`SELECT * from users where id= $1`, [
    userId,
  ]);
  let user = foundUserID?.rows[0];

  console.log("found user", user);
  if (!user) {
    return res.status(401).json({ message: "Invalid UserId" });
    // throw new Error("Invalid Email Address");
  }

  try {
    // create user
    const updateQuery = await db.query(
      `UPDATE users SET role_id = $1 WHERE id = $2 RETURNING *`,
      [newRoleID, userId]
    );

    console.log(updateQuery?.rows[0]);
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
    const deleteUserQuery = await db.query(
      `DELETE FROM users WHERE id=$1`,
      [user_id]
    ); 

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
};
