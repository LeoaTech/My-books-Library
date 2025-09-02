const express = require("express");
const { checkAuth } = require("../../middleware/authMiddleware.js");
const {
  GetAllBooks,
  GetBookById,
  DeleteBook,
  CreateNewBook,
  UpdateBook,
} = require("../../controllers/BooksController/Books.Controllers.js");
require("../../controllers/AuthController/GoogleAuth.js");
const {
  checkRole,
  // checkPermissions,
} = require("../../middleware/authorization.js");

const router = express.Router();

router.use(checkAuth);

// Get list of books
// TODO: Add permission to verify the role permissions

router.get("/", checkRole, GetAllBooks);
router.get("/book", checkRole, GetBookById);

router.delete("/delete/:book_id", checkRole, DeleteBook);

// add book to the list
router.post("/create", checkRole, CreateNewBook);

router.put("/update/:id", checkRole, UpdateBook);

module.exports = router;
