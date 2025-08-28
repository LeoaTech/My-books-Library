const asyncHanlder = require("express-async-handler");
const db = require("../config/dbConfig");

/* Get ALL Branches */
const FetchAllBranch = asyncHanlder(async (req, res) => {
  try {
    const branchesQuery = `SELECT * FROM branches`;
    const getAllBranches = await db.query(branchesQuery);

    res.status(200).json({
      branches: getAllBranches?.rows,
      message: "All Branches Found ",
    });
  } catch (error) {
    console.log(error);
  }
});


/* Fetch All branches by Entity ID */

const FetchEntityBranches = asyncHanlder(async (req, res) => {
  const entityId = req.user.entityId || req.user.entity_id;
  try {
    const branchesQuery = `SELECT * FROM branches where entity_id = $1`;
    const getAllBranches = await db.query(branchesQuery, [entityId]);

    res.status(200).json({
      branches: getAllBranches?.rows,
      message: "Branches fetched associate to the Library ",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = { FetchAllBranch, FetchEntityBranches };
