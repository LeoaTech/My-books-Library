const asyncHanlder = require("express-async-handler");
require("dotenv").config();
const { Client } = require("pg");
const connectionUrl = process.env.CONNECTION_URL;
const client = new Client(connectionUrl);
const cloudinary = require("cloudinary").v2;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Book Controller API connected");
  }
});

// Options for image upload
const options = {
  folder: "books",
  use_filename: true,
  unique_filename: false,
  overwrite: true,
};

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

// Create New Book Data
const CreateNewBook = asyncHanlder(async (req, res) => {
  const { books } = req.body;

  const {
    title,
    rental_price,
    purchase_price,
    author,
    condition,
    cover,
    isbn,
    isAvailable,
    category,
    vendor_id,
    branch_id,
    discount_percentage,
    summary,
    publisher,
    publish_year,
    credit,
    cover_img_url,
    role_id,
  } = books;

  // Upload Images To Cloudinary
  let images = [...cover_img_url];
  const imagesUrls = [];

  try {
    for (let i = 0; i < images.length; i++) {
      const uploadImg = await cloudinary.uploader.upload(images[i], options);
      console.log(uploadImg);
      imagesUrls.push({
        public_id: uploadImg.public_id,
        secureURL: uploadImg.secure_url,
      });
      // return uploadImg?.public_id;
    }
  } catch (error) {
    console.log(error);
  }

  const imagesUrlsJson = JSON.stringify(imagesUrls);

  //   Save Book in database

  if (imagesUrls.length > 0) {
    try {
      const saveBook = await client.query(
        `INSERT INTO books (
          title,
          rental_price,
          purchase_price,
          author,
          condition,
          cover,
          is_available,
          category,
          isbn,
          cover_img_url,
          publisher,
          publish_year,
          vendor_id,
          branch_id, 
          discount_percentage, 
          credit,
          summary,
          added_by
          ) 
          values ($1,$2,$3,$4,$5,$6,$7,$8,$9 ,$10,$11,$12,$13,$14,$15,$16,$17,$18) Returning *`,
        [
          title,
          rental_price,
          purchase_price,
          author,
          condition,
          cover,
          isAvailable,
          category,
          isbn,
          imagesUrlsJson,
          publisher,
          publish_year,
          vendor_id,
          branch_id,
          discount_percentage,
          credit,
          summary,
          role_id,
        ]
      );
      console.log(saveBook?.rowCount, "Book Saved");
      if (saveBook?.rowCount > 0) {
        res.status(200).json({
          books: saveBook?.rows[0],
          message: "Book created successfully",
        });
      } else {
        res.status(400).json({ message: "Error Creating Book" });
      }
    } catch (error) {
      console.log(error, "Error saving book: ");
    }
  } else {
    return res.status(400).json({ message: "Error Uploading Images Files" });
  }
});

module.exports = {
  GetAllBooks,
  GetBookById,
  CreateNewBook,
};