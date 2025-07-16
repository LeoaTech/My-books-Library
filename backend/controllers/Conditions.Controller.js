const asyncHanlder = require("express-async-handler");
const db = require("../config/dbConfig");

/* Get ALL Conditions */

const GetBookCondition = asyncHanlder(async (req, res) => {
  try {
    const bookConditionQuery = `SELECT * FROM conditions`;
    const getAllCondition = await db.query(bookConditionQuery);

    res.status(200).json({
      conditions: getAllCondition?.rows,
      message: "Books Conditions ",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = { GetBookCondition };
