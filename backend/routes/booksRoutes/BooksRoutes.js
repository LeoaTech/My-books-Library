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
  checkPermissions,
} = require("../../middleware/authorization.js");

const router = express.Router();

router.use(checkAuth);

// Get list of books

router.get("/", checkRole, checkPermissions(["READ BOOK"]), GetAllBooks);
router.get("/book", checkRole, checkPermissions(["READ BOOK"]), GetBookById);

router.delete(
  "/delete/:book_id",
  checkRole,
  checkPermissions(["DELETE BOOK"]),
  DeleteBook
);

// add book to the list
router.post(
  "/create",
  checkRole,
  checkPermissions(["CREATE BOOK"]),
  CreateNewBook
);

router.put(
  "/update/:id",
  checkRole,
  checkPermissions(["EDIT BOOK"]),
  UpdateBook
);

module.exports = router;
