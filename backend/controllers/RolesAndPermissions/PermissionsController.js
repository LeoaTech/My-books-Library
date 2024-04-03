const asyncHanlder = require("express-async-handler");
const { Client } = require("pg");
require("dotenv").config();

const connectionUrl = process.env.CONNECTION_URL;

const client = new Client(connectionUrl);

client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Permissions API connected");
  }
});

//    Fetched All Roles from DB
const FetchPermissions = asyncHanlder(async (req, res) => {
  try {
    const permissionQuery = `SELECT * FROM permissions`;
    const getAllPermissions = await client.query(permissionQuery);

    // console.log(getAllPermissions?.rows, "User Found");
    res.status(200).json({
      permissions: getAllPermissions?.rows,
      message: "All Permissions Found ",
    });
  } catch (error) {
    console.log(error);
  }
});

// Create New Permission

const NewPermissions = asyncHanlder(async (req, res) => {
  try {
    const permissionData = req.body;

    const { name } = permissionData;
    const addPermissionQuery = `INSERT INTO permissions (name) values ($1) Returning *`;
    const saveNewPermissions = await client.query(addPermissionQuery, [name]);

    console.log(saveNewPermissions?.rows[0]);

    res
      .status(200)
      .json({ message: "New Permission", result: saveNewPermissions?.rows[0] });
  } catch (error) {
    console.log(error);
  }
});

// Update Existing Permission
const UpdatePermission = asyncHanlder(async (req, res) => {
  try {
    console.log(req.params, req.body);

    const { permission_id } = req.params;
    const permissionData = req.body;
    const { name } = permissionData;

    const findPermissionId = await client.query(
      `SELECT * FROM permissions WHERE permission_id =$1`,
      [permission_id]
    );
    // Check if role Id exists
    if (findPermissionId?.rowCount == 0) {
      res.status(400).json({ message: "Permission Id not exists" });
    } else {
      const updatePermissionQuery = `Update permissions set name =$1 WHERE permission_id = $2 Returning *`;
      const updatePermission = await client.query(updatePermissionQuery, [
        name,
        permission_id,
      ]);

      console.log(updatePermission?.rows[0]);

      res
        .status(200)
        .json({
          message: "Update Permission",
          result: updatePermission?.rows[0],
        });
    }
  } catch (error) {
    console.log(error);
  }
});

// Remove Existing Role

const DeletePermission = asyncHanlder(async (req, res) => {
  try {
    const { permission_id } = req.params;

    console.log(req.params);


    /* Check if Permission ID Exists on Not */
    const findPermissionId = await client.query(
      `SELECT * FROM permissions WHERE permission_id =$1`,
      [permission_id]
    );


    const finRolesPermission = await client.query(
      `SELECT * FROM role_permissions WHERE permission_id =$1`,
      [permission_id]
    );

    console.log(findPermissionId);

    if (finRolesPermission?.rowCount > 0) {
      res.status(400).json({
        message:
          "Permission cannot be Deleted, Permission already Assigned to a Role",
      });
      return;
    } else {
      if (findPermissionId?.rowCount > 0) {
        await client.query(`DELETE from permissions WHERE permission_id =$1`, [permission_id]);

        res.status(200).json({ message: "Delete Permission" });
      } else {
        res.status(200).json({ message: "Permission Id not Exists" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message:
        "Error:Permissions cannot be Deleted",
    });
    return;
  }
});

module.exports = {
  FetchPermissions,
  NewPermissions,
  UpdatePermission,
  DeletePermission,
};
