const asyncHanlder = require("express-async-handler");
const { Client } = require("pg");
require("dotenv").config();

const connectionUrl = process.env.CONNECTION_URL;

const client = new Client(connectionUrl);

client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Braches API connected");
  }
});
/* Get ALL Branches */
const FetchAllBranch = asyncHanlder(async (req, res) => {
  try {
    const branchesQuery = `SELECT * FROM branches`;
    const getAllBranches = await client.query(branchesQuery);

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