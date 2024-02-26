const asyncHanlder = require("express-async-handler");
const { Client } = require("pg");
require("dotenv").config();
const connectionUrl = process.env.CONNECTION_URL;
const client = new Client(connectionUrl);


client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Conditions API connected");
  }
});

/* Get ALL Conditions */

const GetBookCondition = asyncHanlder(async (req, res) => {
  try {
    const bookConditionQuery = `SELECT * FROM conditions`;
    const getAllCondition = await client.query(bookConditionQuery);

    res.status(200).json({
      conditions: getAllCondition?.rows,
      message: "Books Conditions ",
    });
  } catch (error) {
    console.log(error);
  }
});


module.exports = {GetBookCondition}