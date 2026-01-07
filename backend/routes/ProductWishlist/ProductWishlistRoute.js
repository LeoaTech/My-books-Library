const express = require("express");
const { checkAuth } = require("../../middleware/authMiddleware");
const db = require("../../config/dbConfig");
const { pool } = require("../../config/dbConfig");
const router = express.Router();

router.use(checkAuth);

router.post("/api/wishlist", async (req, res) => {
  const { itemId } = req.body;
  const entityId = req.user?.entityId || req?.user?.entity_id;
  const userId = req.user?.userId || req?.user?.user_id;
  const client = await pool.connect();

  try {
    if (!itemId || isNaN(itemId)) {
      return res.status(400).json({ error: "Invalid Book ID" });
    }

    const branchId = await getMainBranchId(client, entityId);
    if (!branchId) {
      throw new Error("Main Branch ID not found.");
    }

    const getBookItem = await client.query(
      `SELECT id,title from books WHERE id = $1 and branch_id =$2`,
      [itemId, branchId]
    );

    const bookId = getBookItem.rows[0]?.id;
    if (!bookId) {
      return res.status(400).json({ error: "No Book ID Exists" });
    }
    const query = `
      INSERT INTO wishlist (entity_id, user_id, book_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (entity_id, user_id, book_id) DO NOTHING
    `;

    const values = [entityId, userId, parseInt(itemId)];

    const result = await client.query(query, values);

    res.status(200).json({ message: "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ error, message: "Failed to Add item to wishlist" });
  }
});

module.exports = router;
