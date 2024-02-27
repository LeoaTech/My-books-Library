const express = require("express");
const requiredAuth = require("../../middleware/authMiddleware.js");
const {
  GetAllBooks,
  GetBookById,
  DeleteBook,
} = require("../../controllers/BooksController/Books.Controllers.js");
// require("../../controllers/AuthController/GoogleAuth.js");

const router = express.Router();

// Get a list of books
router.get("/", GetAllBooks);

router.get("/book", GetBookById);

router.delete("/delete/:book_id", DeleteBook);

module.exports = router;
