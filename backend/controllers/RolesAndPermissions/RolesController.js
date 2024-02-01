const asyncHanlder = require("express-async-handler");
const { Client } = require("pg");
require("dotenv").config();

const connectionUrl = process.env.CONNECTION_URL;

const client = new Client(connectionUrl);

client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Roles API connected");
  }
});


//    Fetched All Roles from DB 
const FetchRoles = asyncHanlder(async (req, res) => {
  try {
    const rolesQuery = `SELECT * FROM roles`;
    const getAllRoles = await client.query(rolesQuery);

    console.log(getAllRoles?.rows, "User Found");
    res.status(200).json({
      roles: getAllRoles?.rows,
      message: "All Roles Found ",
    });
  } catch (error) {
    console.log(error);
  }
});


module.exports={FetchRoles}