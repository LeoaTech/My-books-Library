const asyncHandler = require("express-async-handler");
const db = require("../config/dbConfig");
const { createBranch } = require("../helpers/user_onboarding");
const { pool } = require("../config/dbConfig.js");
/* Get ALL Branches */
const FetchAllBranch = asyncHandler(async (req, res) => {
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

const FetchEntityBranches = asyncHandler(async (req, res) => {
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

const CreateNewBranch = asyncHandler(async (req, res) => {
  console.log(req.body, "New Form");
  const { branchData } = req.body;

  const client = await pool.connect();
  const entityId = req.user.entityId || req.user.entity_id;
  try {
    await client.query("BEGIN");

    let newBranchData = {
      ...branchData,
      businessName: branchData.name,
    };

    const branch = createBranch(client, newBranchData, entityId);
    if (branch) {
      await client.query("COMMIT");
      res.status(201).json({ message: "Successfully created the branch" });
    } else {
      await client.query("ROLLBACK");
      res.status(400).json({ message: "Failed to create new branch" });
    }
  } catch (error) {
    await client.query("ROLLBACK");
    res
      .status(500)
      .json({ message: error.message || "Failed to create new branch" });
  } finally {
    client.release();
  }
});

async function updateBranchData(client, branchData, entityId, branch_id) {
  const { name, city, country, address, phone } = branchData;
  const query = `
    UPDATE branches SET  
    name =$1, 
    city =$2, 
    country =$3,
    address=$4,
    phone=$5
    WHERE id = $6 AND entity_id =$7 
    RETURNING id;
  `;
  const values = [name, city, country, address, phone, branch_id, entityId];
  const result = await client.query(query, values);
  return result.rows[0];
}

const UpdateBranch = asyncHandler(async (req, res) => {
  // console.log(req.body, "Update Form");
  const { branchData } = req.body;
  const { branch_id } = req.params;

  const client = await pool.connect();
  const entityId = req.user.entityId || req.user.entity_id;

  if (!entityId) {
    res.status(400).json({ message: "Invalid Library ID" });
  }

  if (!branch_id) {
    res.status(400).json({ message: "Invalid branch Id" });
  }
  try {
    await client.query("BEGIN");

    const branch = updateBranchData(client, branchData, entityId, branch_id);
    if (branch) {
      await client.query("COMMIT");
      res.status(201).json({ message: "Successfully updated the branch" });
    } else {
      await client.query("ROLLBACK");
      res.status(400).json({ message: "Failed to update branch" });
    }
  } catch (error) {
    await client.query("ROLLBACK");
    res
      .status(500)
      .json({ message: error.message || "Failed to update branch" });
  } finally {
    client.release();
  }
});


module.exports = {
  FetchAllBranch,
  FetchEntityBranches,
  CreateNewBranch,
  UpdateBranch,
};
