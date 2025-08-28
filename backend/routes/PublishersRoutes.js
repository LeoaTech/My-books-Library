const express = require("express");
const {
  FetchPublishers,
  AddNewPublisher,
} = require("../controllers/Publishers.Controller");
const { checkAuth } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(checkAuth);

router.get("/", FetchPublishers);

// Add New Publisher
router.post("/new", AddNewPublisher);

// PUT:Update Publisher details

router.put("/update/:publisher_id");

// DeleteL remove Publisher

router.delete("/remove/:publisher_id");

module.exports = router;
