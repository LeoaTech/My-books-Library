const asyncHanlder = require("express-async-handler");
const db = require("../config/dbConfig");

/* Get ALL Conditions */

const GetBookCondition = asyncHanlder(async (req, res) => {
  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }
  try {
    const bookConditionQuery = `SELECT * FROM conditions where entity_id=$1`;
    const getAllCondition = await db.query(bookConditionQuery, [entityId]);

    res.status(200).json({
      conditions: getAllCondition?.rows,
      message: "Books Conditions ",
    });
  } catch (error) {
    console.log(error);
  }
});





module.exports = { GetBookCondition };
