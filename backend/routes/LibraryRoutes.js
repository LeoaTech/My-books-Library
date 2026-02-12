const express = require("express");
const router = express.Router();
const {
  getLibraryDetails,
  updateLibraryDetails,
  getTransactionHistory,
} = require("../controllers/LibraryController");
const { checkAuth } = require("../middleware/authMiddleware");

// Get library details
router.get("/:entityId", getLibraryDetails);

// Update library details
router.put("/:entityId", updateLibraryDetails);


router.use(checkAuth);
// Get transaction history
router.get("/:entityId/transactions", getTransactionHistory);

module.exports = router;
