const express = require("express");
const { FetchAllBranch } = require("../controllers/Branch.Controller");

const router = express.Router();

router.get("/", FetchAllBranch);

module.exports = router;
