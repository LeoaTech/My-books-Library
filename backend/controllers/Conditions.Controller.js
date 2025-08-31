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

/* Create New Condition */

const CreateCondition = asyncHanlder(async (req, res) => {
  console.log(req.body);

  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }
  try {
    if (!req.body.name) {
      return res.status(400).json("Invalid condition name");
    }
    const updateCondition = await db.query(
      `INSERT INTO conditions (name, entity_id) VALUES ($1, $2) RETURNING id,name`,
      [req.body.name, entityId]
    );

    console.log(updateCondition?.rows[0], "condition Saved");

    res.status(200).json({
      conditions: updateCondition?.rows[0],
      message: "condition Saved Successfully ",
    });
  } catch (error) {
    console.log(error, "Error creating new condition");
    res.status(500).json({
      error,
      message: error.message || "Error Creating condition",
    });
  }
});

/* Update condition Details */

const UpdateCondition = asyncHanlder(async (req, res) => {
  // console.log(req.body);
  try {
    if (!req.body.name) {
      return res.status(400).json("Invalid condition name");
    }

    if (!req.params.condition_id) {
      return res.status(400).json({
        message: "Invalid Condition ID",
      });
    }

    const { name } = req.body;
    const { condition_id } = req.params;
    const updateCondition = await db.query(
      `UPDATE conditions SET name=$1 Where id=$2`,
      [name, condition_id]
    );

    console.log(updateCondition?.rows[0], "condition Updated");

    res.status(200).json({
      categories: updateCondition?.rows[0],
      message: "condition Updated Successfully ",
    });
  } catch (error) {
    console.log(error, "Error Updating conditions");
    res.status(500).json({
      error,
      message: error.message || "Error Updating condition",
    });
  }
});




module.exports = { GetBookCondition, CreateCondition, UpdateCondition };
