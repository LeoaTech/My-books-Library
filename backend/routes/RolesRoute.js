const express = require("express");
const { FetchRoles } = require("../controllers/RolesAndPermissions/RolesController");

const router = express.Router();


router.get("/", FetchRoles)

// router.post(`/roles/:role_id/permissions`, UpdatePermissions);

module.exports = router;