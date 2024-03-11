const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Client } = require("pg");
const RoleService = require("../services/role.services"); // Adjust the path based on your project structure

const connectionUrl = process.env.CONNECTION_URL;

const client = new Client(connectionUrl);

client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("authorization-middlware connected");
  }
});



  /* Authorized Role Id of User */

const checkRole = async (req, res, next) => {
  const userRole = req.user?.role_id;

  try {
    const allowedRoles = await RoleService.getRoles();

    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Forbidden - Insufficient role permissions" });
    }
    console.log("Role is Verified")

    next();
  } catch (error) {
    console.error("Error checking role:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



  /* Verifying Role Permissions */
const checkPermissions = (requiredPermissions) => {
  return async (req, res, next) => {

    console.log(req.user,"permissions")
    const userRole = req.user?.role_id;

    try {
      // Get permissions for the current role id
      const userPermissions = await RoleService?.getRolePermissions(userRole);
      // console.log(userPermissions, "User permissions Available");
      // console.log(requiredPermissions, "Required permissions");

      if (
        !userPermissions ||
        !requiredPermissions?.every((permission) =>
          userPermissions?.includes(permission)
        )
      ) {

        console.log("Not enough permissions")
        return res
          .status(403)
          .json({ message: "Forbidden - Insufficient permissions" });
      }



      console.log("verified permissions")
      next();
    } catch (error) {
      console.error("Error checking permissions:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = { checkPermissions, checkRole };

