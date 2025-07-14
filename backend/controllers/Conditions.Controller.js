const asyncHanlder = require("express-async-handler");
const pool = require("../config/dbConfig");

/* Get ALL Conditions */

const GetBookCondition = asyncHanlder(async (req, res) => {
  try {
    const bookConditionQuery = `SELECT * FROM conditions`;
    const getAllCondition = await pool.query(bookConditionQuery);

    res.status(200).json({
      conditions: getAllCondition?.rows,
      message: "Books Conditions ",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = { GetBookCondition };
