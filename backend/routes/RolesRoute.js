const express = require("express");
const {
  FetchRoles,
  NewRole,
  UpdateRole,
  DeleteRole,
} = require("../controllers/RolesAndPermissions/RolesController");

const router = express.Router();

router.get("/", FetchRoles);

// Add New Role
router.post("/create", NewRole);

// Update Role

router.put("/update/:role_id", UpdateRole);

// Delete Role

router.delete("/remove/:role_id", DeleteRole);




module.exports = router;
