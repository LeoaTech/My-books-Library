const { pool } = require("../config/dbConfig");

const getLibraryDetails = async (req, res) => {
  const { entityId } = req.params;

  try {
    const result = await pool.query(
      "SELECT id, name, subdomain, type_of_books, address, phone, city, country, description, deliver_inter_city,multiple_branches FROM entities WHERE id = $1",
      [entityId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Library data not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching library details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getLibraryDetails,
};
