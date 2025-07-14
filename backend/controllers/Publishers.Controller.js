const asyncHanlder = require("express-async-handler");
const pool = require("../config/dbConfig");

/* Get ALL Publishers */
const FetchPublishers = asyncHanlder(async (req, res) => {
  try {
    const PublishersQuery = `SELECT * FROM publishers`;
    const getAllPublishers = await pool.query(PublishersQuery);

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
  try {
    const createPublisherQuery = await pool.query(
      `INSERT INTO publishers (name) VALUES ($1)`,
      [req.body.name]
    );

    console.log(createPublisherQuery?.rows[0], "Publishers /founded");

    res.status(200).json({
      publishers: createPublisherQuery?.rows[0],
      message: "Publishers Found ",
    });
  } catch (error) {
    console.log(error, "Error creating new Publisher");
  }
});

/* Fetch Publishers By ID */

/* Fetch All Publishers by Book ID */

module.exports = { FetchPublishers,AddNewPublisher };
