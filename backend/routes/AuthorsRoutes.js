const express = require("express");
const { FetchAllAuthors } = require("../controllers/Authors.Controller");

const router = express.Router();

router.get("/", FetchAllAuthors);

// Add New Role
router.post("/new");

// Update Role

router.put("/update/:author_id");

// Delete Role

router.delete("/remove/:author_id");

module.exports = router;
