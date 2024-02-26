const express = require("express");
const {
  FetchPublishers,
  AddNewPublisher,
} = require("../controllers/Publishers.Controller");

const router = express.Router();

router.get("/", FetchPublishers);

// Add New Publisher
router.post("/new", AddNewPublisher);

module.exports = router;
