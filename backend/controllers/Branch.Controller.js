const asyncHanlder = require("express-async-handler");
const pool = require("../config/dbConfig");

/* Get ALL Branches */
const FetchAllBranch = asyncHanlder(async (req, res) => {
  try {
    const branchesQuery = `SELECT * FROM branches`;
    const getAllBranches = await pool.query(branchesQuery);

    res.status(200).json({
      branches: getAllBranches?.rows,
      message: "All Branches Found ",
    });
  } catch (error) {
    console.log(error);
  }
});


/* Fetch Branch By ID */


/* Fetch All branches by Entity ID */

module.exports = {FetchAllBranch}