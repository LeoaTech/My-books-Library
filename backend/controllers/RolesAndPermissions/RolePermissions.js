const asyncHanlder = require("express-async-handler");
const { Client } = require("pg");
require("dotenv").config();

const connectionUrl = process.env.CONNECTION_URL;

const client = new Client(connectionUrl);

client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Roles Permissions API connected");
  }
});

//    Fetched All Roles from DB
const FetchRolePermissions = asyncHanlder(async (req, res) => {
  try {
    const permissionsQuery = `SELECT
  p.permission_id,
  p.name AS permission_name,
  ARRAY_AGG(r.role_id) AS roles
FROM
  public.permissions p
JOIN
  public.role_permissions rp ON p.permission_id = rp.permission_id
JOIN
  public.roles r ON rp.role_id = r.role_id
GROUP BY
  p.permission_id, p.name;
`;
    const getAllPermissions = await client.query(permissionsQuery);
    res.status(200).json({
      permissions: getAllPermissions?.rows,
      message: "All Role Permissions Found ",
    });
  } catch (error) {
    console.log(error);
  }
});

/* Fetch Permissions bases on Role */
const FetchPermissionsByRole = asyncHanlder(async (req, res) => {
  try {
    const { roleId } = req.query;

    const getUnassignedPermissionsQuery = `SELECT
      p.permission_id,
      p.name AS permission_name
  FROM
      public.permissions p
  WHERE
      NOT EXISTS (
          SELECT 1
          FROM public.role_permissions rp
          WHERE rp.role_id = $1
          AND rp.permission_id = p.permission_id
      );
`;

    const unassignedPermissions = await client.query(
      getUnassignedPermissionsQuery,
      [roleId]
    );
    res.status(200).json({
      permissions: unassignedPermissions?.rows,
      message: "All Role Permissions Found ",
    });
  } catch (error) {
    console.log(error);
  }
});

// Get Permission associated to a Role ID
const FetchPermissionsByRoleId = asyncHanlder(async (req, res) => {
  try {
    const { roleId } = req.query;

    const permissionQuery = `SELECT
        rp.role_id,
        p.permission_id,
        p.name AS permission_name
    FROM
        public.role_permissions rp
    JOIN
        public.permissions p ON rp.permission_id = p.permission_id
    WHERE
        rp.role_id = $1;
    `;

    const getAllPermissions = await client.query(permissionQuery, [roleId]);

    // console.log(getAllPermissions?.rows, "Role Permissions found");
    res.status(200).json({
      permissions: getAllPermissions?.rows,
      message: "All Role Permissions Found ",
    });
  } catch (error) {
    console.log(error);
  }
});

// Assign New Permissions for Role ID

const NewRolePermissions = asyncHanlder(async (req, res) => {
  try {
    const permissionData = req.body;
    console.log(permissionData);
    const { permissions } = permissionData;
    const { role_id, permission_id } = permissions;

    const values = permission_id?.map((p) => `(${role_id}, ${p})`).join(",");

    const addPermissionQuery = `
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES
        ${values}
      RETURNING *;
    `;

    const saveNewRolePermissions = await client.query(addPermissionQuery);

    console.log(saveNewRolePermissions?.rows[0]);

    res.status(200).json({
      message: "New Permission",
      result: saveNewRolePermissions?.rows[0],
    });
  } catch (error) {
    console.log(error);
  }
});

// Remove Existing Role Permissions

const DeleteRolePermission = asyncHanlder(async (req, res) => {
  try {
    const { permission_id } = req.body;
    const { role_id } = req.params;
    const permissionsArray = permission_id?.map((p) => Number(p));

    try {
      const deletePermissions = await client.query(
        `DELETE FROM role_permissions WHERE permission_id = ANY($1) AND role_id = $2 RETURNING *`,
        [permissionsArray, role_id]
      );
      // console.log(deletePermissions?.rows);

      res.status(200).json({ message: "Delete Permissions" });
    } catch (err) {
      console.log(err);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error:Permissions cannot be Deleted",
    });
    return;
  }
});

module.exports = {
  FetchRolePermissions,
  FetchPermissionsByRole,
  FetchPermissionsByRoleId,
  NewRolePermissions,
  DeleteRolePermission,
};
