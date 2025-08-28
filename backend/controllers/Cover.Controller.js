const asyncHanlder = require("express-async-handler");
const db = require("../config/dbConfig");

/* Get ALL Cover types */

const getBookCovers = asyncHanlder(async (req, res) => {
  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }
  try {
    const bookCoversQuery = `SELECT * FROM covers where entity_id =$1`;
    const getAllCovers = await db.query(bookCoversQuery, [entityId]);

    res.status(200).json({
      covers: getAllCovers?.rows,
      message: "Books Covers ",
    });
  } catch (error) {
    console.log(error);
  }
});



module.exports = { getBookCovers };
