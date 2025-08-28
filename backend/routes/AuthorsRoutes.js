const express = require("express");
const {
  FetchAllAuthors,
  AddNewAuthor
} = require("../controllers/Authors.Controller");
const { checkAuth } = require("../middleware/authMiddleware");

const router = express.Router();
// Verify User Authentication (Logged-in users can see this route)
router.use(checkAuth);

//Get: fetch Authors List
router.get("/", FetchAllAuthors);

// Post: Add New Author
router.post("/new", AddNewAuthor);

// PUT:Update Author details

router.put("/update/:author_id");

// DeleteL remove Author

router.delete("/remove/:author_id");

module.exports = router;
