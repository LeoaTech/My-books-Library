const express = require("express");
const { checkAuth } = require("../../middleware/authMiddleware.js");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const fs = require("fs");
const os = require("os"); 

const { pool } = require("../../config/dbConfig.js");

const {
  getMainBranchId,
  getOrCreateId,
} = require("../../helpers/books/index.js");

const {
  uploadOne,
} = require("../../controllers/BooksController/Books.Controllers.js");

router.use(checkAuth);

// const upload = multer({ dest: "uploads/" });
const upload = multer({ dest: os.tmpdir() }); 

router.post("/api/upload", upload.single("file"), (req, res) => {
  const user = req.user;
  const filePath = req.file.path;
  const fileExtension = req.file.originalname.split(".").pop();
  let books = [];

  if (fileExtension === "csv") {
    const stream = fs.createReadStream(filePath);

    stream.on("error", (err) => {
      console.error("Error during file stream:", err);
      fs.unlinkSync(filePath);
      return res
        .status(500)
        .send({ message: "An error occurred while reading the file." });
    });

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => books.push(data))
      .on("end", () => {
        insertBooks(books, res, filePath, user);
      });
  } else if (fileExtension === "xlsx" || fileExtension === "xls") {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    books = xlsx.utils.sheet_to_json(worksheet);
    insertBooks(books, res, filePath, user);
  } else {
    fs.unlinkSync(filePath);
    return res.status(400).send({ message: "Unsupported file type." });
  }
});

const insertBooks = async (books, res, filePath, user) => {
  const { entityId, roleId } = user;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const branchId = await getMainBranchId(client, entityId);
    // console.log("branchId", branchId);
    for (const book of books) {
      const authorId = await getOrCreateId(
        client,
        "authors",
        book.author,
        entityId
      );
      // console.log("Author", authorId);
      const publisherId = await getOrCreateId(
        client,
        "publishers",
        book.publisher,
        entityId
      );
      // console.log("publisher", publisherId);
      const categoryId = await getOrCreateId(
        client,
        "categories",
        book.category,
        entityId
      );
      // console.log("categories", categoryId);
      const coverTypeId = await getOrCreateId(
        client,
        "covers",
        book.cover,
        entityId
      );
      // console.log("covers", coverTypeId);
      const conditionId = await getOrCreateId(
        client,
        "conditions",
        book.condition,
        entityId
      );
 
      let images = [...book.cover_img_url];
      let imagesUrlsJson;
      let failedImagesCount = 0;
      if (
        book.cover_img_url &&
        Array.isArray(book.cover_img_url) &&
        book.cover_img_url.length > 0
      ) {
        try {
          const uploadPromises = images.map((img) => uploadOne(img, options));

          const uploadResults = await Promise.allSettled(uploadPromises);

          const successfulImages = [];

          uploadResults.forEach((result, index) => {
            if (result.status === "fulfilled" && result.value !== null) {
              successfulImages.push(result.value);
            } else {
              failedImagesCount++;
              console.error(
                `Image at index ${index} failed:`,
                result.reason?.message || "Unknown Error"
              );
            }
          });
          imagesUrlsJson = JSON.stringify(successfulImages);
        } catch (error) {
          console.log("Error uploading images to Cloudinary: ", error);
          imagesUrlsJson = JSON.stringify([]);
        }
      }

      const saveBook = await client.query(
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
                values ($1,$2,$3,$4,$5,$6,$7,$8,$9 ,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19, $20) Returning id`,
        [
          book.title,
          book?.member_price || "0",
          book?.purchase_price || "0",
          authorId,
          conditionId,
          coverTypeId,
          book?.isAvailable === "true" || book?.isAvailable === true,
          categoryId,
          book?.isbn,
          imagesUrlsJson,
          publisherId,
          book.publish_year,
          book?.vendor_id || null,
          branchId,
          book?.discount_percentage || "0",
          book?.credit || 1,
          book?.summary || "",
          roleId,
          book?.edition || "",
          book?.quantity || 1,
        ]
      );
      console.log(saveBook.rowCount, "Book");
    }
    await client.query("COMMIT");
    res
      .status(200)
      .send({ message: "File uploaded and data inserted successfully." });
  } catch (e) {
    await client.query("ROLLBACK");
    res
      .status(500)
      .send({ message: "Error inserting data into the database." });
    console.error(e);
  } finally {
    client.release();
    fs.unlinkSync(filePath);
  }
};

module.exports = router;
