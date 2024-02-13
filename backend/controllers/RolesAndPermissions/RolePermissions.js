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

module.exports = {
  FetchRolePermissions,
};
