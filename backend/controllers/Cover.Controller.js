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

/* Add New Cover Type for  */

const AddCoverType = asyncHanlder(async (req, res) => {
  console.log(req.body);
  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }
  if (!req.body.name) {
    return res.status(400).json("Invalid cover name");
  }
  try {
    const updateCoverQuery = await db.query(
      `INSERT INTO covers (name, entity_id) VALUES ($1,$2) Returning id ,name`,
      [req.body.name, entityId]
    );

    console.log(updateCoverQuery?.rows[0], "Cover Saved");

    res.status(200).json({
      covers: updateCoverQuery?.rows[0],
      message: "New Cover Saved Successfully ",
    });
  } catch (error) {
    console.log(error, "Error creating new cover");
    res.status(500).json({
      error,
      message: error.message || "Error Creating cover",
    });
  }
});



module.exports = { getBookCovers,AddCoverType };
