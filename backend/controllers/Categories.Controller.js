const asyncHanlder = require("express-async-handler");
const { Client } = require("pg");
require("dotenv").config();

const connectionUrl = process.env.CONNECTION_URL;
const client = new Client(connectionUrl);

client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Categories API connected");
  }
});
/* Get ALL Categories */
const GetCategories = asyncHanlder(async (req, res) => {
  try {
    const categoriesQuery = `SELECT * FROM categories`;
    const getAllCategories = await client.query(categoriesQuery);

    res.status(200).json({
      categories: getAllCategories?.rows,
      message: "Books Categories Found ",
    });
  } catch (error) {
    console.log(error);
  }
});


module.exports = { GetCategories };
