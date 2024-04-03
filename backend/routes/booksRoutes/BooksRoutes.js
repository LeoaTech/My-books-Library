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

// Get a list of books

router.get("/", checkRole, checkPermissions(["READ A BOOK"]), GetAllBooks);
router.get("/book", checkRole, checkPermissions(["READ A BOOK"]), GetBookById);

router.delete(
  "/delete/:book_id",
  checkRole,
  checkPermissions(["DELETE A BOOK"]),
  DeleteBook
);

// add a book to the list
router.post(
  "/create",
  checkRole,
  checkPermissions(["CREATE A BOOK"]),
  CreateNewBook
);

router.put(
  "/update/:id",
  checkRole,
  checkPermissions(["EDIT A BOOK"]),
  UpdateBook
);

module.exports = router;
