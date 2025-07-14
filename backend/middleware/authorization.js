const jwt = require("jsonwebtoken");
require("dotenv").config();
const RoleService = require("../services/role.services"); 

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

