const express = require("express");
const requiredAuth = require("../../middleware/authMiddleware.js");
const {
  GetAllBooks,
} = require("../../controllers/BooksController/Books.Controllers.js");
// require("../../controllers/AuthController/GoogleAuth.js");

const router = express.Router();

// Get a list of books
router.get("/", GetAllBooks);

module.exports = router;
