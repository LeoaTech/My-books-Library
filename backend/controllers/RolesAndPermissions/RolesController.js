const asyncHanlder = require("express-async-handler");
const db = require("../../config/dbConfig");

//    Fetched All Roles from DB
const FetchRoles = asyncHanlder(async (req, res) => {
  try {
    const rolesQuery = `SELECT * FROM roles`;
    const getAllRoles = await db.query(rolesQuery);

    // console.log(getAllRoles?.rows, "User Found");
    res.status(200).json({
      roles: getAllRoles?.rows,
      message: "All Roles Found ",
    });
  } catch (error) {
    console.log(error);
  }
});

// Create New Role

const NewRole = asyncHanlder(async (req, res) => {
  try {
    const roleData = req.body;

    const { name } = roleData;
    const addRoleQuery = `INSERT INTO roles (name) values ($1) Returning *`;
    const saveNewRole = await db.query(addRoleQuery, [name]);

    console.log(saveNewRole?.rows[0]);

    res.status(200).json({ message: "New Role", result: saveNewRole?.rows[0] });
  } catch (error) {
    console.log(error);
  }
});

// Update Existing Role
const UpdateRole = asyncHanlder(async (req, res) => {
  try {
    console.log(req.params, req.body);

    const { role_id } = req.params;
    const roleData = req.body;
    const { name } = roleData;

    const findRoleId = await db.query(
      `SELECT * FROM roles WHERE role_id =$1`,
      [role_id]
    );
    // Check if role Id exists
    if (findRoleId?.rowCount == 0) {
      res.status(400).json({ message: "RoleId not exists" });
    } else {
      const updateRoleQuery = `Update roles set name =$1 WHERE role_id = $2 Returning *`;
      const updateRole = await db.query(updateRoleQuery, [name, role_id]);

      console.log(updateRole?.rows[0]);

      res
        .status(200)
        .json({ message: "Update role", result: updateRole?.rows[0] });
    }
  } catch (error) {
    console.log(error);
  }
});

// Remove Existing Role

const DeleteRole = asyncHanlder(async (req, res) => {
  try {
    const { role_id } = req.params;

    console.log(req.params);

    const findRoleId = await db.query(
      `SELECT * FROM roles WHERE role_id =$1`,
      [role_id]
    );

    const findUserRoleId = await db.query(
      `SELECT * FROM users2 WHERE role_id =$1`,
      [role_id]
    );

    // console.log(findRoleId)

    if (findUserRoleId?.rowCount > 0) {
      res.status(400).json({
        message: "Role cannot be Deleted, a user Already have this RoleId",
      });
      return;
    } else {
      if (findRoleId?.rowCount > 0) {
        await db.query(`DELETE from roles WHERE role_id =$1`, [role_id]);

        res.status(200).json({ message: "Delete Role" });
      } else {
        res.status(200).json({ message: "Role Id not Exists" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Role cannot be Deleted, a user Already have this RoleId",
    });
    return;
  }
});

module.exports = { FetchRoles, NewRole, UpdateRole, DeleteRole };
