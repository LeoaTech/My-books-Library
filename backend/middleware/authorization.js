const jwt = require("jsonwebtoken");
require("dotenv").config();
const RoleService = require("../services/role.services");

/* Authorized Role Id of User */

const checkRole = async (req, res, next) => {
  // console.log(req.user, "Check User's info");

  // TODO: Get also user Library's ID
  const userRoleId = req.user?.roleId || req?.user?.role_id;
  const entityId = req.user?.entityId;

  if (!entityId) {
    return res
      .status(401)
      .json({
        message: "Role Id must be associated to an Entity",
      });
  }

  try {
    const allowedRoles = await RoleService.getRoles(entityId);

    if (!allowedRoles.includes(userRoleId)) {
      return res
        .status(403)
        .json({ message: "Forbidden - Not Permitted to Access" });
    }
    console.log("Role is Verified");

    next();
  } catch (error) {
    console.error("Error checking role auth:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

/* Verifying Role Permissions */
const checkPermissions = (requiredPermissions) => {
  return async (req, res, next) => {
    const userRoleId = req.user?.roleId;

    try {
      // Get permissions for the current role id
      const userPermissions = await RoleService?.getRolePermissions(userRoleId);
      // console.log(userPermissions, "User permissions Available");
      // console.log(requiredPermissions, "Required permissions");

      if (
        !userPermissions ||
        !requiredPermissions?.every((permission) =>
          userPermissions?.includes(permission)
        )
      ) {
        console.log("Not enough permissions");
        return res
          .status(403)
          .json({ message: "Forbidden - Insufficient permissions" });
      }

      console.log("verified permissions");
      next();
    } catch (error) {
      console.error("Error checking permissions:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = { checkPermissions, checkRole };
