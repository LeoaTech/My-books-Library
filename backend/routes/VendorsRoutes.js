const express = require("express");
const { GetVendors, NewVendor, DeleteVendor } = require("../controllers/Vendors.Controller");

const router = express.Router();

router.get("/", GetVendors);


// Add New Vendors Details

router.post("/new", NewVendor);


// Remove Vendor Details


router.delete("/remove/:role_id", DeleteVendor);

module.exports = router;
