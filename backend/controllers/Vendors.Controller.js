const asyncHanlder = require("express-async-handler");
const { Client } = require("pg");
require("dotenv").config();

const connectionUrl = process.env.CONNECTION_URL;

const client = new Client(connectionUrl);

client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Vendors API connected");
  }
});
/* Get ALL vendors */
const GetVendors = asyncHanlder(async (req, res) => {
  try {
    const vendorsQuery = `SELECT * FROM vendors`;
    const getAllVendors = await client.query(vendorsQuery);

    console.log(getAllVendors?.rows)
    res.status(200).json({
      vendors: getAllVendors?.rows,
      message: "Vendors Found ",
    });
  } catch (error) {
    console.log(error);
  }
});



/* Fetch vendors By ID */

/* Fetch All vendors by Book ID */

module.exports = { GetVendors };
