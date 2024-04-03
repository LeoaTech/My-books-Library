const express = require("express");
const {GetCategories } = require("../controllers/Categories.Controller");

const router = express.Router();


router.get("/", GetCategories);

module.exports = router;
