const express = require("express");
const requiredAuth = require("../../middleware/authMiddleware.js");
const {
  GetAllBooks,
  GetBookById,
} = require("../../controllers/BooksController/Books.Controllers.js");
// require("../../controllers/AuthController/GoogleAuth.js");

const router = express.Router();

// Get a list of books
router.get("/", GetAllBooks);

// Get a Book by BookId
router.get("/book", GetBookById);

module.exports = router;
