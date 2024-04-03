const express = require("express");
const { GetVendors } = require("../controllers/Vendors.Controller");

const router = express.Router();

router.get("/", GetVendors);

module.exports = router;
