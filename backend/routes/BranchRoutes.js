const express = require("express");
const {
  FetchAllBranch,
  FetchEntityBranches,
} = require("../controllers/Branch.Controller");
const {checkAuth} = require("../middleware/authMiddleware")
const router = express.Router();


// Verify that user must be logged in

router.use(checkAuth);
// GET: fetch All Branches
// router.get("/", FetchAllBranch);

// Fetch Branches for a Library (Entity Id)
router.get("/", FetchEntityBranches);

// POST: Add New Branch
router.post("/new");

// PUT:Update Branch details

router.put("/update/:branch_id");
module.exports = router;
