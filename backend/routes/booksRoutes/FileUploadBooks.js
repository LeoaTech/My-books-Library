const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const fs = require("fs");
const os = require("os");

const { pool } = require("../../config/dbConfig.js");
const { checkAuth } = require("../../middleware/authMiddleware.js");
const {
  getMainBranchId,
  getOrCreateId,
} = require("../../helpers/books/index.js");
const {
  uploadBulkImage,
} = require("../../helpers/books/CloudinaryUploadImages.js");

router.use(checkAuth);

const upload = multer({ dest: os.tmpdir() });
let pLimit;

(async () => {
  pLimit = await import("p-limit");
})();

router.post("/api/upload", upload.single("file"), async (req, res) => {
  const user = req.user;
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded." });
  }
  const filePath = req.file.path;
  const fileExtension = req.file.originalname.split(".").pop().toLowerCase();
  let books = [];

  const cleanup = () => {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  };

  try {
    if (fileExtension === "csv") {
      const stream = fs.createReadStream(filePath);

      stream.on("error", (err) => {
        console.error("file stream error:", err);
        cleanup();
        return res.status(500).send({ message: "Error reading file stream." });
      });

      stream
        .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
        .on("data", (data) => books.push(data))
        .on("end", async () => {
          await insertBooks(books, res, filePath, user);
        })
        .on("error", (err) => {
          console.error("CSV Parsing Error:", err);
          cleanup();
          res.status(500).send({ message: "Error parsing CSV file." });
        });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      books = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

      await insertBooks(books, res, filePath, user);
    } else {
      cleanup();
      return res
        .status(400)
        .send({ message: "Unsupported file type. Select CSV or Excel." });
    }
  } catch (error) {
    cleanup();
    console.error("File processing error:", error);
    res.status(500).send({ message: "Failed to process file." });
  }
});

const insertBooks = async (books, res, filePath, user) => {
  const entityId = user?.entityId || user?.entity_id;
  const roleId = user?.roleId || user?.role_id;
  const client = await pool.connect();

  const { default: pLimit } = await import("p-limit");
  const limit = pLimit(5);
  try {
    await client.query("BEGIN");
    const branchId = await getMainBranchId(client, entityId);
    if (!branchId) {
      throw new Error("Main Branch ID not found.");
    }
    const processedRows = await Promise.all(
      books.map((book) =>
        limit(async () => {
          try {
            const title = book.title || book.Title;
            const authorName = book.author || book.Author;
            const publisherName = book.publisher || book.Publisher;
            const categoryName = book.category || book.Category;
            const coverName = book.cover || book.Cover;
            const conditionName = book.condition || book.Condition;

            if (!title || !authorName) {
              return null;
            }
            const [
              authorId,
              publisherId,
              categoryId,
              coverTypeId,
              conditionId,
            ] = await Promise.all([
              getOrCreateId(client, "authors", authorName, entityId),
              getOrCreateId(client, "publishers", publisherName, entityId),
              getOrCreateId(client, "categories", categoryName, entityId),
              getOrCreateId(client, "covers", coverName, entityId),
              getOrCreateId(client, "conditions", conditionName, entityId),
            ]);

            if (
              !authorId ||
              !publisherId ||
              !categoryId ||
              !coverTypeId ||
              !conditionId
            ) {
              console.warn(
                `Skip Book [${title}]: Failed to find reference IDs (Author, Publisher, Category, Cover, or Condition).`
              );
              return null;
            }

            const validBranchId = parseInteger(book.branch_id) || branchId;
            if (!validBranchId) {
              console.warn(`Book skipped [${title}]: Invalid Branch ID.`);
              return null;
            }

            let finalImageUrls = [];
            let rawImages = [];
            let coverField = book.cover_img_url || book.cover_img || "[]";

            if (coverField) {
              if (Array.isArray(coverField)) {
                rawImages = coverField;
              } else if (typeof coverField === "string") {
                coverField = coverField.trim();
                try {
                  rawImages = JSON.parse(coverField);
                } catch (e) {
                  rawImages = coverField
                    .split(",")
                    .map((s) => s.replace(/[\[\]"']/g, "").trim())
                    .filter((s) => s.length > 0);
                }
              }
            }

            if (!Array.isArray(rawImages)) rawImages = [rawImages];

            const validImagesToUpload = rawImages.filter((img) =>
              isValidUrl(img)
            );

            if (validImagesToUpload.length > 0) {
              console.log(
                `Start processing [${book.title}] images to upload ${validImagesToUpload.length}.`
              );

              const uploadPromises = validImagesToUpload.map((img) =>
                uploadBulkImage(img)
                  .then((res) => {
                    const url = res?.secure_url || res?.url;
                    if (url) {
                      return res || null;
                    }
                    console.warn(
                      `No response found for [${book.title}] images from Cloudinary.`
                    );
                    return null;
                  })
                  .catch((err) => {
                    console.error(
                      `Image for [${book.title}] failed to upload`,
                      err.message
                    );
                    return null;
                  })
              );

              const results = await Promise.all(uploadPromises);
              finalImageUrls = results.filter((img) => img !== null);
            } else {
              console.log(
                `No cover image url for [${book.title}] exists to upload.`
              );
            }

            return {
              title: title,
              member_price: String(book.member_price ?? "0"),
              purchase_price: String(book.purchase_price ?? "0"),
              authorId,
              conditionId,
              coverTypeId,
              is_available: parseBoolean(book.isAvailable || book.is_available),
              categoryId,
              isbn: String(book.isbn ?? "").trim(),
              cover_img_url: JSON.stringify(finalImageUrls),
              publisherId,
              publish_year: String(book.publish_year ?? ""),
              vendor_id: book.vendor_id || null,
              branch_id: validBranchId,
              discount_percentage: String(book.discount_percentage ?? "0"),
              credit: parseInteger(book.credit) || 1,
              summary: String(book.summary ?? "") || "",
              added_by: roleId,
              edition: String(book.edition ?? ""),
              quantity: parseInteger(book.quantity) || 1,
            };
          } catch (error) {
            console.error(
              `Skipping book "${book.title}" due to unexpected error:`,
              error?.message
            );
            return null;
          }
        })
      )
    );

    const validBooks = processedRows.filter((b) => b !== null);
    // console.log(validBooks, "Books");
    if (validBooks.length === 0) {
      await client.query("ROLLBACK");
      return res
        .status(400)
        .send({ message: "Incomplete books data..Failed to insert." });
    }

    // Bulk Insert Books
    const columnCount = 20;

    const queryText = `
      INSERT INTO books (
        title, member_price, purchase_price, author, condition, 
        cover, is_available, category, isbn, cover_img_url, 
        publisher, publish_year, vendor_id, branch_id, discount_percentage, 
        credit, summary, added_by, edition, quantity
      )
      VALUES ${validBooks
        .map(
          (_, index) =>
            `(${Array.from(
              { length: columnCount },
              (_, i) => `$${index * columnCount + i + 1}`
            ).join(", ")})`
        )
        .join(", ")}
      RETURNING id
    `;

    const queryValues = validBooks.flatMap((b) => [
      b.title,
      b.member_price,
      b.purchase_price,
      b.authorId,
      b.conditionId,
      b.coverTypeId,
      b.is_available,
      b.categoryId,
      b.isbn,
      b.cover_img_url,
      b.publisherId,
      b.publish_year,
      b.vendor_id,
      b.branch_id,
      b.discount_percentage,
      b.credit,
      b.summary,
      b.added_by,
      b.edition,
      b.quantity,
    ]);

    const saveBook = await client.query(queryText, queryValues);

    await client.query("COMMIT");
    res.status(200).send({
      message: "File processed successfully.",
      totalProcessed: books.length,
      successCount: saveBook.rowCount,
      failedCount: books.length - saveBook.rowCount,
    });
  } catch (e) {
    await client.query("ROLLBACK");
    res
      .status(500)
      .send({ message: "Error inserting data into the database." });
    console.error(e);
  } finally {
    client.release();
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};
const parseBoolean = (val) => {
  console.log(val, "Boolean value");

  if (typeof val === "boolean") return val;
  if (!val) return false;
  const s = String(val).toLowerCase().trim();
  return s === true || s === "true" || s === "1" || s === "yes";
};
const parseInteger = (val) => {
  if (val === null || val === undefined || val === "") return null;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? null : parsed;
};
module.exports = router;
