const asyncHanlder = require("express-async-handler");
const { Client } = require("pg");
require("dotenv").config();

const connectionUrl = process.env.CONNECTION_URL;

const client = new Client(connectionUrl);

client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Orders API connected");
  }
});

/* Fetch All Orders Details */

const FetchAllOrders = asyncHanlder(async (req, res) => {
  try {
    const ordersQuery = `SELECT * FROM Orders`;
    const getAllOrders = await client.query(ordersQuery);

    res.status(200).json({
      orders: getAllOrders?.rows,
      message: "All Orders Found ",
    });
  } catch (error) {
    console.log(error);
  }
});

/* Fetch Order By Order ID */

const FetchOrderById = asyncHanlder(async (req, res) => {
  try {
    res.status(200).json({
      message: "Order by ID retrieved",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  FetchAllOrders,
  FetchOrderById
};
