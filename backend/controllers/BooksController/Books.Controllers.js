const asyncHandler = require("express-async-handler");
const db = require("../../config/dbConfig");
const { uploadOne } = require("../../helpers/books/CloudinaryUploadImages");


// Get All Books

const GetAllBooks = asyncHandler(async (req, res) => {
  const user = req.user;
  const entityId = user?.entityId || user?.entity_id;

  if (!entityId) {
    res.status(400).json({ message: "No Library Exists " });
  }
  const fetchBooksFromMultipleBranches = `SELECT
    books.id,
    books.title,
    books.summary,
    books.member_price,
    books.purchase_price,
    books.discount_percentage,
    books.publish_year,
    books.edition,
    books.quantity,
    branches.name AS branch_name,
    branches.id AS branch_id,
    vendors.id AS vendor_id,
    books.author,
    authors.name AS author_name,
    covers.name AS cover_name,
    books.cover,
    categories.name AS category_name,
    books.category,
    conditions.name AS condition_name,
    books.condition,
    publishers.name AS publisher_name,
    books.publisher,
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
LEFT JOIN public.vendors ON books.vendor_id = vendors.id   
JOIN public.conditions ON books.condition = conditions.id
JOIN public.branches ON books.branch_id = branches.id
JOIN public.publishers ON books.publisher = publishers.id
JOIN public.categories ON books.category = categories.id
WHERE
    books.branch_id = ANY ($1); `;

  // Get All the branches related to an Entity Id (for a specific library)

  const getEntityBranches = `Select id from branches where entity_id = $1`;
  try {
    const getBranchIds = await db.query(getEntityBranches, [entityId]);
    console.log(getBranchIds.rows, "Branches");

    if (getBranchIds.rowCount == 0) {
      res
        .status(400)
        .json({ message: "No Books Exists for this Library", books: [] });
    }

    let branchIds = getBranchIds.rows.map((branch) => branch.id);
    const getBooksList = await db.query(fetchBooksFromMultipleBranches, [
      branchIds,
    ]);

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

const GetAvailableBooks = asyncHandler(async (req, res) => {
  const user = req.user;

  const entityId = user?.entityId || user?.entity_id;

  // console.log(req.user, "User Object", entityId, "Entity ID");

  if (!entityId) {
    res.status(400).json({ message: "No Library Exists " });
  }
  const fetchAvailableBooks = `
    SELECT
        b.id,
        b.edition,
        b.quantity,
        b.title,
        b.summary,
        b.member_price,
        b.purchase_price,
        b.discount_percentage,
        b.publish_year,
        br.name AS branch_name,
        v.id AS vendor_id,
        a.name AS author_name,
        c.name AS cover_name,
        cat.name AS category_name,
        cond.name AS condition_name,
        p.name AS publisher_name,
        b.is_available AS Available,
        b.comments,
        b.added_by,
        b.cover_img_url,
        b.isbn,
        b.credit,
        b.created_at
    FROM
        public.books b
    JOIN public.authors a ON b.author = a.id
    JOIN public.covers c ON b.cover = c.id
    LEFT JOIN public.vendors v ON b.vendor_id = v.id   
    JOIN public.conditions cond ON b.condition = cond.id
    JOIN public.branches br ON b.branch_id = br.id
    JOIN public.publishers p ON b.publisher = p.id
    JOIN public.categories cat ON b.category = cat.id
    WHERE
        b.branch_id = ANY ($1)
        AND b.id NOT IN (
            SELECT DISTINCT (item->>'id')::int
            FROM public.bookings,
                 jsonb_array_elements(items) AS item
            WHERE (item->>'status') IS DISTINCT FROM 'returned'
        );
  `;

  // Get All the branches related to an Entity Id (for a specific library)

  const getEntityBranches = `Select id from branches where entity_id = $1`;
  try {
    const getBranchIds = await db.query(getEntityBranches, [entityId]);
    // console.log(getBranchIds.rows, "Branches");

    if (getBranchIds.rowCount == 0) {
      res
        .status(400)
        .json({ message: "No Books Exists for this Library", books: [] });
    }

    let branchIds = getBranchIds.rows.map((branch) => branch.id);
    const getBooksList = await db.query(fetchAvailableBooks, [branchIds]);

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

const GetBookById = asyncHandler(async (req, res) => {
  const { bookId } = req.query;
  const bookQuery = `SELECT
      books.id,
      books.title,
      books.summary,
      books.member_price,
      books.purchase_price,
      books.discount_percentage,
      books.publish_year,
      books.branch_id,
      branches.name AS branch_name,
      vendors.id AS vendor_id,
      vendors.name As vendor,
      authors.name AS author_name,
      books.author,
      covers.name AS cover_name,
      books.cover,
      categories.name AS category_name,
      books.category,
      conditions.name AS condition_name,
      books.condition,
      publishers.name AS publisher_name,
      books.publisher,
      books.is_available AS Available,
      books.comments,
      books.added_by,
      books.cover_img_url,
      books.isbn,
      books.credit,
      books.created_at
  FROM public.books
  JOIN public.authors ON books.author = authors.id
  JOIN public.covers ON books.cover = covers.id
  LEFT JOIN public.vendors ON books.vendor_id = vendors.id
  JOIN public.conditions ON books.condition = conditions.id
  JOIN public.branches ON books.branch_id = branches.id
  JOIN public.publishers ON books.publisher = publishers.id
  JOIN public.categories ON books.category = categories.id
  WHERE books.id = $1`;
  try {
    const getBookDetail = await db.query(bookQuery, [bookId]);

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
const CreateNewBook = asyncHandler(async (req, res) => {
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
    edition,
    quantity,
  } = books;

  // Upload Images To Cloudinary
  let images = [...cover_img_url];
  let imagesUrls = [];

  try {
    const uploadPromises = images.map((img) => uploadOne(img, options));

    const uploadResults = await Promise.all(uploadPromises);

    imagesUrls = uploadResults.map((result) => ({
      ...result,
    }));

    console.log("All images uploaded successfully:", imagesUrls);
  } catch (error) {
    console.log("Error uploading images to Cloudinary: ", error);
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
          added_by,
          edition,
          quantity
          ) 
          values ($1,$2,$3,$4,$5,$6,$7,$8,$9 ,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19, $20) Returning *`,
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
        edition,
        quantity,
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
    res
      .status(400)
      .json({ error, message: error.message || "Error Creating Book" });
  }
});

// Delete a Book Data   (admin route only)

const DeleteBook = asyncHandler(async (req, res) => {
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
const UpdateBook = asyncHandler(async (req, res) => {
  const { book } = req.body;
  // console.log(req.body, "Update Form");

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
    edition,
    quantity,
  } = book;

  let failedUploadImage;
  let countFailedUpload;
  let imagesUrlsJson;
  if (imageUpdated && Array.isArray(cover_img_url)) {
    let images = [...cover_img_url];
    try {
      const uploadPromises = images?.map((img) => uploadOne(img, options));

      const uploadResults = await Promise.allSettled(uploadPromises);

      const successfulUploads = uploadResults
        .filter(
          (result) => result.status == "fulfilled" && result.value !== null
        )
        .map((r) => r.value);

      failedUploadImage = uploadResults.filter(
        (res) => res.status == "rejected"
      );
      countFailedUpload = failedUploadImage.length;

      if (countFailedUpload > 0) {
        console.warn(`${countFailedUpload} images failed to upload.`);
        failedUploadImage.forEach((f) => console.error("Reason:", f.reason));
      }
      if (successfulUploads.length > 0) {
        imagesUrlsJson = JSON.stringify(successfulUploads);
      } else if (successfulUploads.length === 0 && uploadErrors > 0) {
        const oldImagesOnly = cover_img_url.filter(
          (img) => img.secure_url || (Array.isArray(img.url) && !img.base64)
        );
        imagesUrlsJson = JSON.stringify(oldImagesOnly);
        console.log(
          "All new image uploads failed. keeping the existing db images only."
        );
      } else {
        imagesUrlsJson = JSON.stringify([]);
      }
    } catch (error) {
      console.log("Error uploading images to Cloudinary: ", error);
      const oldImagesOnly = cover_img_url.filter((img) => !img.base64);
      imagesUrlsJson = JSON.stringify(oldImagesOnly);
    }
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
      cover_img_url=$17,
      edition=$18,
      quantity=$19
      WHERE 
      id = $20
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
        edition,
        quantity,
        bookId,
      ]
    );

    // console.log(updateBook?.rows[0]);
    if (updateBook?.rowCount > 0) {
      const response = {
        result: updateBook?.rows[0],
        message: "Book Updated successfully",
      };

      if (countFailedUpload > 0) {
        response.warning = `${countFailedUpload} images failed to upload`;
      }
      return res.status(200).json(response);
    }
    res.status(400).json({ message: "Error Updating Book" });
  } catch (error) {
    console.log(error, "Error Updating book: ");
    return res.status(500).json({ message: "Error Updating Book" });
  }
});

module.exports = {
  GetAllBooks,
  GetAvailableBooks,
  GetBookById,
  CreateNewBook,
  DeleteBook,
  UpdateBook,
  uploadOne,
};
