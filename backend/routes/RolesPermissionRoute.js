const express = require("express");
const {
  FetchRolePermissions,
  NewRolePermissions,
  DeleteRolePermission,
  FetchPermissionsByRole,
  FetchPermissionsByRoleId,
} = require("../controllers/RolesAndPermissions/RolePermissions");

const router = express.Router();

// Get All Roles Permissions
router.get("/", FetchRolePermissions);
router.get("/permission", FetchPermissionsByRole);
router.get("/permissions", FetchPermissionsByRoleId);

router.post("/permission/add", NewRolePermissions);

router.delete("/permission/:role_id", DeleteRolePermission);

module.exports = router;
