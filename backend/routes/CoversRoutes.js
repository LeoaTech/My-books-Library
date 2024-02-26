const express = require("express");
const { getBookCovers } = require("../controllers/Cover.Controller");

const router = express.Router();

router.get("/", getBookCovers);

module.exports = router;
