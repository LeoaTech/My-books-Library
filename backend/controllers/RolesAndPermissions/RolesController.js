const asyncHandler = require("express-async-handler");
const db = require("../../config/dbConfig");
const defaultRoles = ["owner", "vendor", "customer"];

//    Fetched Roles from DB that belongs to a specific entity
const FetchRoles = asyncHandler(async (req, res) => {

  const entityId = req?.user?.entityId || req.user?.entity_id;
  try {
    const rolesQuery = `SELECT * FROM roles where entity_id =$1`;
    const getAllRoles = await db.query(rolesQuery, [entityId]);

    res.status(200).json({
      roles: getAllRoles?.rows,
      message: "All Roles Found ",
    });
  } catch (error) {
    // console.log(error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch roles" });
  }
});

// Create New Role

const NewRole = asyncHandler(async (req, res) => {

  const roleData = req.body.roleForm;
  const { name, entityId } = roleData;

  if (!name) {
    return res.status(400).json({ message: "Invalid Role Name" });
  }
  if (!entityId) {
    return res.status(400).json({ message: "Entity ID Missing" });
  }

    if (defaultRoles?.includes(name.toLowerCase())) {
    return res.status(400).json({ message: `Please Enter different Role Name, ${name} is the default role name` });
  }
  let lowerCaseName = name.toLowerCase(); //always saved in lower case
  try {
    const addRoleQuery = `INSERT INTO roles (name,entity_id,is_default) values ($1,$2,$3) Returning *`;
    const saveNewRole = await db.query(addRoleQuery, [lowerCaseName, entityId, false]);


    res
      .status(200)
      .json({ message: "New Role", newRole: saveNewRole?.rows[0] }); //saveNewRole?.rows[0]
  } catch (error) {
    // console.log(error);
    res
      .status(500)
      .json({ message: error.message || "Failed to Create New Role" });
  }
});

// Update Existing Role
const UpdateRole = asyncHandler(async (req, res) => {
  // console.log(req.params, "params", req.body, "Body");
  const { role_id } = req.params;

  if (!role_id) {
    return res.status(400).json({ message: "Invalid Role ID" });
  }

  const roleData = req.body;
  const { name, entityId } = roleData;

  if (defaultRoles.includes(name.toLowerCase())) {
    return res.status(400).json({ message: `Please Enter different Role Name, ${name} is the default role name` });
  }
  if (!entityId) {
    return res.status(400).json({ message: "Entity ID Missing" });
  }
  try {
    const findRoleId = await db.query(
      `SELECT * FROM roles WHERE role_id =$1 and entity_id=$2`,
      [role_id, entityId]
    );
    // Check if role Id exists
    if (findRoleId?.rowCount == 0) {
      return res.status(400).json({ message: "RoleId not exists" });
    } else {
      const updateRoleQuery = `Update roles set name =$1 WHERE role_id = $2 and entity_id =$3 Returning *`;
      const updateRole = await db.query(updateRoleQuery, [
        name,
        role_id,
        entityId,
      ]);
      return res
        .status(200)
        .json({ message: "Update role", result: updateRole?.rows[0] });
    }
  } catch (error) {
    // console.log(error);
    res
      .status(500)
      .json({ message: error.message || "Failed to update the Role" });
  }
});

// Remove Existing Role

const DeleteRole = asyncHandler(async (req, res) => {
  try {
    const { role_id } = req.params;

    if (!role_id) {
      res.status(400).json({ message: "Role ID Missing " });
    }

    const { entityId } = req.body;
    if (!entityId) {
      res
        .status(400)
        .json({ message: "Entity ID Missing, Failed to Delete Role ID" });
    }
    const findRoleId = await db.query(
      `SELECT role_id FROM roles WHERE role_id =$1 and entity_id =$2`,
      [role_id, entityId]
    );

    if (findRoleId.rowCount == 0) {
      res.status(400).json({ message: "Role Id not Found" });
    }

    const findUserRoleId = await db.query(
      `SELECT user_id FROM user_entity_roles WHERE role_id =$1`,
      [role_id]
    );

    // console.log(findRoleId)

    if (findUserRoleId?.rowCount > 0) {
      res.status(400).json({
        message: "Role cannot be Deleted, a user Already have this RoleId",
      });
      return;
    } else {
      await db.query(`DELETE from roles WHERE role_id =$1`, [role_id]);

      res.status(200).json({ message: "Delete Role" });
    }
  } catch (error) {
    // console.log(error);
    res.status(400).json({
      message: "Role cannot be Deleted, RoleId is assigned to a User",
    });
    return;
  }
});

module.exports = { FetchRoles, NewRole, UpdateRole, DeleteRole };
