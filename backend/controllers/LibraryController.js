const { pool } = require("../config/dbConfig");
const { checkSubdomain } = require("../helpers/user_onboarding");

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

const updateLibraryDetails = async (req, res) => {
  const { entityId } = req.params;
  const {
    name,
    subdomain,
    type_of_books,
    address,
    phone,
    city,
    country,
    description,
    deliverIntercity,
    hasMultipleBranches,
  } = req.body;


  try {
    let uniqueSubdomain;
    if(subdomain){
      uniqueSubdomain = await checkSubdomain(subdomain)
    }
    const result = await pool.query(
      `UPDATE entities 
       SET name = $1, subdomain = $2, type_of_books = $3, address = $4, phone = $5, city = $6, country = $7, description = $8, deliver_inter_city = $9, multiple_branches = $10, updated_at = NOW()
       WHERE id = $11 RETURNING *`,
      [
        name,
        uniqueSubdomain,
        type_of_books,
        address,
        phone,
        city,
        country,
        description,
        deliverIntercity,
        hasMultipleBranches,
        entityId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Library not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating library details:", error);
    if (error.code === "23505") {
      return res.status(400).json({ message: "Subdomain already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTransactionHistory = async (req, res) => {
  const { entityId } = req.params;

  try {
    // Fetch transactions for the library (entity)
    // We join with users to ensure we get transactions for the user associated with this entity
    const result = await pool.query(
      `SELECT ct.id, ct.amount_paid, ct.status, ct.invoice_pdf, ct.created_at, ct.stripe_invoice_id,
              cs.stripe_price_id
       FROM client_transactions ct
       JOIN users u ON ct.user_id = u.id
       JOIN user_entity_roles uer ON u.id = uer.user_id
       LEFT JOIN client_subscription cs ON ct.client_subscription_id = cs.id
       WHERE uer.entity_id = $1
       ORDER BY ct.created_at DESC`,
      [entityId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getLibraryDetails,
  updateLibraryDetails,
  getTransactionHistory,
};
