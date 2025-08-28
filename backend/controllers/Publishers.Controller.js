const asyncHanlder = require("express-async-handler");
const db = require("../config/dbConfig");

/* Get ALL Publishers */
const FetchPublishers = asyncHanlder(async (req, res) => {
  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }
  try {
    const PublishersQuery = `SELECT * FROM publishers WHERE entity_id =$1`;
    const getAllPublishers = await db.query(PublishersQuery, [entityId]);

    res.status(200).json({
      publishers: getAllPublishers?.rows,
      message: "Publishers Found ",
    });
  } catch (error) {
    console.log(error);
  }
});




module.exports = { FetchPublishers };
