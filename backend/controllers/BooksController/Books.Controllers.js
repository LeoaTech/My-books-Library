const asyncHanlder = require("express-async-handler");
const db = require("../../config/dbConfig");
const cloudinary = require("cloudinary").v2;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

// Options for image upload on cloudinary
const options = {
  folder: "books",
  use_filename: true,
  unique_filename: false,
  overwrite: true,
};

// Get All Books

const GetAllBooks = asyncHanlder(async (req, res) => {
  try {
    const getBooksList = await db.query(`SELECT
    books.id,
    books.title,
    books.summary,
    books.member_price,
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

    console.log(getBooksList?.rowCount, "Books available");
    // if (getBooksList?.rowCount > 0) {
    res.status(200).json({
      books: getBooksList?.rows || [],
      message: "Book Retrieved successfully",
    });
    // }
  } catch (error) {
    console.log(err, "Error getting books");
    return res.status(500).json({ message: "No books found" });
  }
});

// Get a Book by ID

const GetBookById = asyncHanlder(async (req, res) => {
  const { bookId } = req.query;

  try {
    const getBookDetail = await db.query(
      `SELECT
    books.id,
    books.title,
    books.summary,
    books.member_price,
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
    } else {
      res.status(400).json({
        message: "Book details failed to retrieved",
      });
    }
  } catch (error) {
    console.log(error.message, "Error getting book Details");
    res.status(500).json({
      message: error.message || "Book details failed to retrieved",
    });
  }
});

// Create New Book Data
const CreateNewBook = asyncHanlder(async (req, res) => {
  const { books } = req.body;

  const {
    title,
    member_price,
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
      const uploadImg = await cloudinary.uploader.upload(
        images[i].base64,
        options
      );
      console.log(uploadImg);
      imagesUrls.push({...uploadImg});
      // return uploadImg?.public_id;
    }
  } catch (error) {
    console.log(error);
  }

  const imagesUrlsJson = JSON.stringify(imagesUrls);

  //   Save Book in database with or without images

  try {
    const saveBook = await db.query(
      `INSERT INTO books (
          title,
          member_price,
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
        member_price,
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
      return res.status(200).json({
        books: saveBook?.rows[0],
        message:
          imagesUrls.length > 0
            ? "Book Details saved successfully"
            : "Book Details Saved without cover_images",
      });
    } else {
      return res.status(400).json({ message: "Error Creating Book" });
    }
  } catch (error) {
    console.log(error, "Error saving book: ");
    res.status(400).json({ message: error.message || "Error Creating Book" });
  }
});

// Delete a Book Data   (admin route only)

const DeleteBook = asyncHanlder(async (req, res) => {
  const { book_id } = req.params;

  // Delete images from cloudinary server
  try {
    await cloudinary.api
      .delete_resources(req.body.imageIds, {
        type: "upload",
        resource_type: "image",
      })
      .then((result) => console.log(result, "Book deleted successfully"));

    // Delete book from DB
    const deleteQuery = await db.query(`DELETE FROM books WHERE id=$1`, [
      book_id,
    ]);

    console.log(deleteQuery?.rowCount, "Deleted");

    if (deleteQuery?.rowCount > 0) {
      res.status(200).json({ message: "Book deleted Suuccessfully" });
    } else {
      res.status(204).json({ message: "Failed To Delete Book" });
    }
  } catch (error) {
    console.log(error);
  }
});

// Update A Book Details
const UpdateBook = asyncHanlder(async (req, res) => {
  const { book } = req.body;
  const {
    title,
    member_price,
    purchase_price,
    author,
    condition,
    cover,
    available,
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
    bookId,
    imageUpdated,
  } = book;

  let imagesUrlsJson;
  if (imageUpdated) {
    let images = [...cover_img_url];
    const imagesUrls = [];

    try {
      for (let i = 0; i < images.length; i++) {
        if (!images[i].public_id || !images[i].secure_url) {
          const uploadImg = await cloudinary.uploader.upload(
            images[i].base64,
            options
          );
          console.log(uploadImg);
          imagesUrls.push({ ...uploadImg });
          // return uploadImg?.public_id;
        } else {
          imagesUrls.push(images[i]);
        }
      }
    } catch (error) {
      console.log(error);
    }

    imagesUrlsJson = JSON.stringify(imagesUrls);
  } else {
    imagesUrlsJson = JSON.stringify(cover_img_url);
  }

  //   Save Book in database
  try {
    const updateBook = await db.query(
      `UPDATE books SET 
      title =$1,
      member_price=$2,
      purchase_price=$3,
      condition=$4,
      cover=$5,
      category=$6,
      isbn=$7,
      is_available=$8,
      vendor_id=$9,
      branch_id=$10,
      discount_percentage=$11,
      summary=$12,
      publish_year=$13,
      publisher=$14,
      credit=$15,
      author=$16,
      cover_img_url=$17
      WHERE 
      id = $18
       Returning *`,
      [
        title,
        member_price,
        purchase_price,
        condition,
        cover,
        category,
        isbn,
        available,
        vendor_id,
        branch_id,
        discount_percentage,
        summary,
        publish_year,
        publisher,
        credit,
        author,
        imagesUrlsJson,
        bookId,
      ]
    );

    // console.log(updateBook?.rows[0]);
    if (updateBook?.rowCount > 0) {
      return res.status(200).json({ message: "Book Updated successfully" });
    }
    res.status(400).json({ message: "Error Updating Book" });
  } catch (error) {
    console.log(error, "Error Updating book: ");
    return res.status(500).json({ message: "Error Updating Book" });
  }

  // res.status(200).json({ message: "Book updated Successfully" });
});

module.exports = {
  GetAllBooks,
  GetBookById,
  CreateNewBook,
  DeleteBook,
  UpdateBook,
};
