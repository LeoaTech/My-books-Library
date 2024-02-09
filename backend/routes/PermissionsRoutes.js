const express = require("express");
const {
  NewPermissions,
  UpdatePermission,
  DeletePermission,
  FetchPermissions,
} = require("../controllers/RolesAndPermissions/PermissionsController");

const router = express.Router();

router.get("/", FetchPermissions);

// Add New Permission
router.post("/create", NewPermissions);

// Update Permission

router.put("/update/:permission_id", UpdatePermission);

// Delete Permission

router.delete("/remove/:permission_id", DeletePermission);

module.exports = router;
