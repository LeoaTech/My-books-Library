const asyncHandler = require("express-async-handler");
const db = require("../config/dbConfig");

/* Get ALL Publishers */
const FetchPublishers = asyncHandler(async (req, res) => {
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
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch publishers" });
  }
});

/* Create New Publisher */

const AddNewPublisher = asyncHandler(async (req, res) => {

  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }
  try {
    if (!req.body.publishersForm) {
      return res.status(400).json("Invalid Publisher Details");
    }

    const { name, links, description } = req.body.publishersForm;

    const createPublisherQuery = await db.query(
      `INSERT INTO publishers (name, links,description, entity_id) VALUES ($1, $2,$3, $4) RETURNING id,name`,
      [name, links, description, entityId],
    );


    res.status(200).json({
      publishers: createPublisherQuery?.rows[0],
      message: "Publishers Found ",
    });
  } catch (error) {
    // console.log(error, "Error creating new Publisher");
    res.status(500).json({
      error,
      message: error.message || "Error Creating Publishers",
    });
  }
});

/* Update Publisher Details */

const UpdatePublisher = asyncHandler(async (req, res) => {
  try {
    if (!req.body.publishersForm) {
      return res.status(400).json("Invalid Publishers Details");
    }

    if (!req.params.publisher_id) {
      return res.status(400).json({
        message: "Invalid Publisher ID",
      });
    }

    const { name, links, description } = req.body.publishersForm;
    const { publisher_id } = req.params;
    const createPublisherQuery = await db.query(
      `UPDATE publishers SET name=$1, links=$2, description=$3 Where id=$4`,
      [name, links, description, publisher_id],
    );


    res.status(200).json({
      publishers: createPublisherQuery?.rows[0],
      message: "Publisher Updated Successfully ",
    });
  } catch (error) {
    // console.log(error, "Error Updating publisher");
    res.status(500).json({
      error,
      message: error.message || "Error Updating Publisher",
    });
  }
});

module.exports = { FetchPublishers, AddNewPublisher, UpdatePublisher };
