const asyncHanlder = require("express-async-handler");
const db = require("../config/dbConfig");

/* Get ALL Categories */
const GetCategories = asyncHanlder(async (req, res) => {
  try {
    const categoriesQuery = `SELECT * FROM categories`;
    const getAllCategories = await db.query(categoriesQuery);

    res.status(200).json({
      categories: getAllCategories?.rows,
      message: "Books Categories Found ",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = { GetCategories };
