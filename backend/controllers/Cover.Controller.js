const asyncHanlder = require("express-async-handler");
const { Client } = require("pg");
require("dotenv").config();

const connectionUrl = process.env.CONNECTION_URL;
const client = new Client(connectionUrl);

client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Covers Connected");
  }
});

/* Get ALL Cover types */

const getBookCovers = asyncHanlder(async (req, res) => {
  try {
    const bookCoversQuery = `SELECT * FROM covers`;
    const getAllCovers = await client.query(bookCoversQuery);

    res.status(200).json({
      covers: getAllCovers?.rows,
      message: "Books Covers ",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = { getBookCovers };
