const express = require("express");
const {
  FetchAllAuthors,
  AddNewAuthor,
} = require("../controllers/Authors.Controller");

const router = express.Router();

router.get("/", FetchAllAuthors);

// Add New Author
router.post("/new", AddNewAuthor);

// Update Author

router.put("/update/:author_id");

// Delete Author

router.delete("/remove/:author_id");

module.exports = router;
