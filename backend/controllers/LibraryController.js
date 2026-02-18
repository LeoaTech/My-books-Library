const { pool } = require("../config/dbConfig");
const { checkSubdomain } = require("../helpers/user_onboarding");
const { uploadOne } = require("../helpers/books/CloudinaryUploadImages");

const getLibraryDetails = async (req, res) => {
  const { entityId } = req.params;

  try {
    let query, params;

    if (!isNaN(entityId)) {
        // Fetch by ID
        query = `SELECT e.id, e.name, e.subdomain, e.type_of_books, e.address, e.phone, e.city, e.country, e.description, e.deliver_inter_city, e.multiple_branches, e.library_logo, s.theme_config 
       FROM entities e
       LEFT JOIN settings s ON e.id = s.entity_id
       WHERE e.id = $1`;
       params = [entityId];
    } else {
        // Fetch by Subdomain
        query = `SELECT e.id, e.name, e.subdomain, e.type_of_books, e.address, e.phone, e.city, e.country, e.description, e.deliver_inter_city, e.multiple_branches, e.library_logo, s.theme_config 
       FROM entities e
       LEFT JOIN settings s ON e.id = s.entity_id
       WHERE e.subdomain = $1`;
       params = [entityId];
    }

    const result = await pool.query(query, params);

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
    library_logo,
  } = req.body;

  try {
    let uniqueSubdomain;
    if (subdomain) {
      uniqueSubdomain = await checkSubdomain(subdomain);
    }

    let logoUrl = undefined;
    if (library_logo) {
      // Check if it is a base64 string 
      if (library_logo?.startsWith("data:image")) {
        const matches = library_logo?.match(/^data:(.+);base64,/);
        const mimeType = matches ? matches[1] : "image/jpeg";

        const uploadResult = await uploadOne(
          { base64: library_logo, type: mimeType },
          { folder: "library_logos" },
        );
        logoUrl = uploadResult;
      } else {
        logoUrl = library_logo;
      }
    }


   

    const result = await pool.query(
      `UPDATE entities 
       SET name = $1, subdomain = $2, type_of_books = $3, address = $4, phone = $5, city = $6, country = $7, description = $8, deliver_inter_city = $9, multiple_branches = $10, library_logo = COALESCE($11, library_logo), updated_at = NOW()
       WHERE id = $12 RETURNING *`,
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
        JSON.stringify(logoUrl),
        entityId,
      ],
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
  const userId = req.user?.userId|| req?.user?.user_id;

  try {
    const roleQuery = await pool.query(
      `SELECT r.name 
       FROM user_entity_roles uer
       JOIN roles r ON uer.role_id = r.role_id
       WHERE uer.user_id = $1 AND uer.entity_id = $2`,
      [userId, entityId]
    );

    if (roleQuery.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "User is not associated with this library" });
    }

    const roleName = roleQuery.rows[0].name.toLowerCase();
    let query;
    let params;

    if (roleName === "owner" || roleName === "admin") {
      // Client Transactions 
     query = `
        SELECT ct.id, ct.amount_paid, ct.status, ct.invoice_pdf, ct.created_at, ct.stripe_invoice_id,
               cs.stripe_price_id
        FROM client_transactions ct
        LEFT JOIN client_subscription cs ON ct.client_subscription_id = cs.id
        WHERE ct.user_id = $1
        ORDER BY ct.created_at DESC
      `;
      params = [userId];
    } else {
      // Customer Subscription Transactions
      query = `
        SELECT st.id, st.amount_paid, st.status, st.invoice_pdf, st.created_at, st.stripe_invoice_id,
               s.stripe_price_id
        FROM subscription_transactions st
        JOIN subscriptions s ON st.subscription_id = s.id
        JOIN membership_plan mp ON s.plan_id = mp.plan_id
        WHERE st.user_id = $1 AND mp.entity_id = $2
        ORDER BY st.created_at DESC
      `;
      params = [userId, entityId];
    }

    const result = await pool.query(query, params);
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
