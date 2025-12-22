const express = require("express");
const { checkAuth } = require("../../middleware/authMiddleware");
const db = require("../../config/dbConfig");

const router = express.Router();

router.use(checkAuth);

router.post("/api/wishlist", async (req, res) => {
  const { itemId } = req.body;
  const { entityId, userId } = req.user;

  try {
    if (!itemId || isNaN(itemId)) {
      return res.status(400).json({ error: "Invalid Book ID" });
    }

    const query = `
      INSERT INTO wishlist (entity_id, user_id, book_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (entity_id, user_id, book_id) DO NOTHING
    `;

    const values = [entityId, userId, parseInt(itemId)];

    const result = await db.query(query, values);

    res.status(200).json({ message: "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});

module.exports = router;
