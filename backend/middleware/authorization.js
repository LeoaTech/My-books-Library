const jwt = require("jsonwebtoken");
require("dotenv").config();
const RoleService = require("../services/role.services");

/* Authorized Role Id of User */

const checkRole = async (req, res, next) => {

  const userRoleId = req.user?.roleId || req?.user?.role_id;
  const entityId = req.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(401).json({
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
    // console.log("Role is Verified");

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
    const userRoleId = req.user?.roleId || req?.user?.role_id;
    if (!userRoleId) {
      return res.status(403).json({ error: "Role not found",message:"Role ID not Found"  });
    }

    try {
      // Get permissions for the current role id
      const userPermissions = await RoleService?.getRolePermissions(userRoleId);
    
      if (!userPermissions || !userPermissions?.includes(requiredPermissions)) {
        return res
          .status(403)
          .json({ message: "Forbidden - Insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error("Error checking permissions:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = { checkPermissions, checkRole };
