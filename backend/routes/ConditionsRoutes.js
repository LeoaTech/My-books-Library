const express = require("express");
const { GetBookCondition } = require("../controllers/Conditions.Controller");

const router = express.Router();

router.get("/", GetBookCondition);


module.exports = router;
