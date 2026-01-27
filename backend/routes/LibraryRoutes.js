const express = require("express");
const router = express.Router();
const {
  getLibraryDetails,
  updateLibraryDetails,
} = require("../controllers/LibraryController");

// Get library details
router.get("/:entityId", getLibraryDetails);

// Update library details
router.put("/:entityId", updateLibraryDetails);

module.exports = router;
