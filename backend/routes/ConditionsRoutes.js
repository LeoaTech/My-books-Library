const express = require("express");
const {
  GetBookCondition,
  CreateCondition,
} = require("../controllers/Conditions.Controller");
const { checkAuth } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(checkAuth);

router.get("/", GetBookCondition);

// Post: Add New Condition
router.post("/new", CreateCondition);

// PUT:Update Conditions types

router.put("/update/:condition_id");

module.exports = router;
