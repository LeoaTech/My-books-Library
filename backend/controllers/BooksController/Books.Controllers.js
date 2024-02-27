const asyncHanlder = require("express-async-handler");
require("dotenv").config();
const { Client } = require("pg");
const connectionUrl = process.env.CONNECTION_URL;
const client = new Client(connectionUrl);

client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Book Controller API connected");
  }
});

// Get All Books

const GetAllBooks = asyncHanlder(async (req, res) => {
  try {
    const getBooksList = await client.query(`SELECT
    books.id,
    books.title,
    books.summary,
    books.rental_price,
    books.purchase_price,
    books.discount_percentage,
    books.publish_year,
    branches.name AS branch_name,
    vendors.id AS vendor_id,
    authors.name AS author_name,
    covers.name AS cover_name,
    categories.name AS category_name,
    conditions.name AS condition_name,
    publishers.name AS publisher_name,
    books.is_available AS Available,
    books.comments,
    books.added_by,
    books.cover_img_url,
    books.isbn,
    books.credit,
    books.created_at
FROM
    public.books
JOIN public.authors ON books.author = authors.id
JOIN public.covers ON books.cover = covers.id
JOIN public.vendors ON books.vendor_id = vendors.id
JOIN public.conditions ON books.condition = conditions.id
JOIN public.branches ON books.branch_id = branches.id
JOIN public.publishers ON books.publisher = publishers.id
JOIN public.categories ON books.category = categories.id;`);

    // console.log(getBooksList?.rows);
    if (getBooksList?.rowCount > 0) {
      res.status(201).json({
        books: getBooksList?.rows,
        message: "Book Retrieved successfully",
      });
    }
  } catch (error) {
    console.log(err, "Error getting books");
  }
});

// Get a Book by ID

const GetBookById = asyncHanlder(async (req, res) => {
  const { bookId } = req.query;

  try {
    const getBookDetail = await client.query(
      `SELECT
    books.id,
    books.title,
    books.summary,
    books.rental_price,
    books.purchase_price,
    books.discount_percentage,
    books.publish_year,
    branches.name AS branch_name,
    branches.id AS branch_id,
    vendors.name AS vendor,
    vendors.id AS vendor_id,
    authors.id AS author_id,
    authors.name AS author_name,
    covers.name AS cover_name,
    covers.id AS cover_id,
    categories.name AS category_name,
    categories.id AS category_id,
    conditions.name AS condition_name,
    conditions.id AS condition_id,
    publishers.name AS publisher_name,
    publishers.id AS publisher_id,
    books.is_available AS Available,
    books.comments,
    books.added_by,
    books.cover_img_url,
    books.isbn,
    books.credit,
    books.created_at
FROM
    public.books
JOIN public.authors ON books.author = authors.id
JOIN public.covers ON books.cover = covers.id
JOIN public.vendors ON books.vendor_id = vendors.id
JOIN public.conditions ON books.condition = conditions.id
JOIN public.branches ON books.branch_id = branches.id
JOIN public.publishers ON books.publisher = publishers.id
JOIN public.categories ON books.category = categories.id
WHERE books.id=$1
`,
      [bookId]
    );

    console.log(getBookDetail?.rows[0]);
    if (getBookDetail?.rowCount > 0) {
      res.status(200).json({
        book: getBookDetail?.rows[0],
        message: "Book Retrieved successfully",
      });
    }
  } catch (error) {
    console.log(error.message, "Error getting book Details");
  }
});

module.exports = {
  GetAllBooks,
  GetBookById,
};
