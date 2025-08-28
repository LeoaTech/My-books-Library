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



module.exports = { GetCategories };
