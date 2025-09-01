const express = require("express");
const {
  GetCategories,
  AddNewCategory,
  UpdateCategory,
} = require("../controllers/Categories.Controller");
const { checkAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Verify User Authentication (Logged-in users can see this route)
router.use(checkAuth);

//Get: fetch Categories List

router.get("/", GetCategories);

// Post: Add New Category
router.post("/new", AddNewCategory);

// PUT:Update Category

router.put("/update/:category_id", UpdateCategory);

// Delete: remove Category

router.delete("/remove/:category_id");

module.exports = router;
