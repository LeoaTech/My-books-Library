const asyncHanlder = require("express-async-handler");
const pool = require("../config/dbConfig");

/* Get ALL Cover types */

const getBookCovers = asyncHanlder(async (req, res) => {
  try {
    const bookCoversQuery = `SELECT * FROM covers`;
    const getAllCovers = await pool.query(bookCoversQuery);

    res.status(200).json({
      covers: getAllCovers?.rows,
      message: "Books Covers ",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = { getBookCovers };
