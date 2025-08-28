const express = require("express");
const {
  getBookCovers,
  AddCoverType,

} = require("../controllers/Cover.Controller");
const { checkAuth } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(checkAuth);

router.get("/", getBookCovers);

// Post: Add New Cover Type
router.post("/new", AddCoverType);

// PUT:Update Cover type

router.put("/update/:cover_id");

module.exports = router;
