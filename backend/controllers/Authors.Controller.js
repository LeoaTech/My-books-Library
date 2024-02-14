const asyncHanlder = require("express-async-handler");
const { Client } = require("pg");
require("dotenv").config();

const connectionUrl = process.env.CONNECTION_URL;

const client = new Client(connectionUrl);

client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Authors API connected");
  }
});
/* Get ALL Authorses */
const FetchAllAuthors = asyncHanlder(async (req, res) => {
  try {
    const AuthorsQuery = `SELECT * FROM authors`;
    const getAllAuthors = await client.query(AuthorsQuery);

    res.status(200).json({
      authors: getAllAuthors?.rows,
      message: "Authors Found ",
    });
  } catch (error) {
    console.log(error);
  }
});


/* Fetch Authors By ID */


/* Fetch All Authors by Book ID */

module.exports = {FetchAllAuthors}