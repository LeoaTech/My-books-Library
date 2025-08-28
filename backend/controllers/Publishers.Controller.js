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

/* Create New Publisher */

const AddNewPublisher = asyncHanlder(async (req, res) => {
  console.log(req.body);

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
      `INSERT INTO publishers (name, links,description, entity_id) VALUES ($1, $2,$3, $4)`,
      [name, links, description, entityId]
    );

    console.log(createPublisherQuery?.rows[0], "Publishers Added ");

    res.status(200).json({
      publishers: createPublisherQuery?.rows[0],
      message: "Publishers Found ",
    });
  } catch (error) {
    console.log(error, "Error creating new Publisher");
    res.status(500).json({
      error,
      message: error.message || "Error Creating Publishers",
    });
  }
});




module.exports = { FetchPublishers ,AddNewPublisher};
