const asyncHanlder = require("express-async-handler");
const db = require("../config/dbConfig");

/* Get ALL Categories */
const GetCategories = asyncHanlder(async (req, res) => {
  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }

  try {
    const categoriesQuery = `SELECT * FROM categories WHERE entity_id =$1`;
    const getAllCategories = await db.query(categoriesQuery, [entityId]);

    res.status(200).json({
      categories: getAllCategories?.rows,
      message: "Books Categories Found ",
    });
  } catch (error) {
    console.log(error);
  }
});

/* Create New Category */

const AddNewCategory = asyncHanlder(async (req, res) => {
  console.log(req.body, "Category Payload");

  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }
  try {
    if (!req.body?.name) {
      return res.status(400).json("Invalid Category");
    }
    const updateCategory = await db.query(
      `INSERT INTO categories (name, entity_id) VALUES ($1, $2) Returning id, name`,
      [req.body.name, entityId]
    );

    console.log(updateCategory?.rows[0], "Category Saved");

    res.status(200).json({
      categories: updateCategory?.rows[0],
      message: "Category Saved Successfully ",
    });
  } catch (error) {
    console.log(error, "Error creating new category");
    res.status(500).json({
      error,
      message: error.message || "Error Creating Category",
    });
  }
});

module.exports = { GetCategories, AddNewCategory };
