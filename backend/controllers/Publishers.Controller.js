const asyncHanlder = require("express-async-handler");
const { Client } = require("pg");
require("dotenv").config();

const connectionUrl = process.env.CONNECTION_URL;

const client = new Client(connectionUrl);

client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Publishers API connected");
  }
});
/* Get ALL Publishers */
const FetchPublishers = asyncHanlder(async (req, res) => {
  try {
    const PublishersQuery = `SELECT * FROM publishers`;
    const getAllPublishers = await client.query(PublishersQuery);

    res.status(200).json({
      publishers: getAllPublishers?.rows,
      message: "Publishers Found ",
    });
  } catch (error) {
    console.log(error);
  }
});



/* Fetch Publishers By ID */

/* Fetch All Publishers by Book ID */

module.exports = { FetchPublishers};
