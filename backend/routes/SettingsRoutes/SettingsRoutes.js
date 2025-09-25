const express = require("express");

const { checkAuth } = require("../../middleware/authMiddleware");
const { FetchSettings, UpdateSettings } = require("../../controllers/SettingsController/Settings.Controller");

const router = express.Router();
// Verify User Authentication (Logged-in users can see this route)
router.use(checkAuth);

//Get: fetch Settings for Library
router.get("/", FetchSettings);

// Post: Add New Settings
router.post("/update", UpdateSettings);

module.exports = router;
