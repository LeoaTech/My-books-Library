const express = require("express");
const {
  FetchRoles,
  NewRole,
  UpdateRole,
  DeleteRole,
} = require("../controllers/RolesAndPermissions/RolesController");
const { checkAuth } = require("../middleware/authMiddleware");

const router = express.Router();
// Protect the Route to access only by Signed-in users

router.use(checkAuth);

// Add Middleware to verify role_id and its permissions to access roles content
router.get("/", FetchRoles);

// Add New Role
router.post("/create", NewRole);

// Update Role

router.put("/update/:role_id", UpdateRole);

// Delete Role

router.delete("/remove/:role_id", DeleteRole);

module.exports = router;
