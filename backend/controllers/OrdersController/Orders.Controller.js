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

/* Create an Order */

// ?TODO: Validate the Duplicate Entries of Order details 
const CreateNewOrder = asyncHanlder(async (req, res) => {
  // console.log(req.body);
  try {
    const { orderForm } = req.body;

    const {
      name,
      email,
      address,
      city,
      country,
      phone,
      payment_id,
      mode_of_payment,
      shipping_address,
      shipping_city,
      shipping_country,
      shipping_phone,
      discount_code,
      discount_value,
      items, //Items will always be an array [{book_id,book_title}]
      tracking_id,
      order_by,
      order_on,
    } = orderForm;

    try {
      const createOrderQuery = `INSERT INTO orders (
        name,
        email,
        address,
        city,
        country,
        phone,
        payment_id,
        mode_of_payment,
        shipping_address,
        shipping_city,
        shipping_country,
        shipping_phone,
        discount_code,
        discount_value,
        items,
        tracking_id,
        order_by,
        order_on) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) Returning *`;

      const saveNewOrder = await client.query(createOrderQuery, [
        name,
        email,
        address,
        city,
        country,
        phone,
        payment_id,
        mode_of_payment,
        shipping_address,
        shipping_city,
        shipping_country,
        shipping_phone,
        discount_code,
        discount_value,
        JSON.stringify(items), // Serialize items to JSON string
        tracking_id,
        order_by,
        order_on,
      ]);

      console.log(saveNewOrder?.rowCount, "1 Order Created");
      res.status(200).json({
        message: "Order Created Successfully",
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

/* Delete Order */

const DeleteOrder = asyncHanlder(async (req, res) => {
  const { order_id } = req.params;
  try {
    const deleteOrderQuery = `DELETE FROM orders WHERE id =$1`;

    const deleteOrderdetails = await client.query(deleteOrderQuery, [order_id]);

    console.log(deleteOrderdetails?.rowCount);
    res.status(200).json({
      message: "Delete Order ",
    });
  } catch (error) {
    console.log(error);
  }
});

/* Update Order */

const UpdateOrder = asyncHanlder(async (req, res) => {
  try {
    const { orderForm } = req.body;

    const {
      name,
      email,
      address,
      city,
      country,
      phone,
      payment_id,
      mode_of_payment,
      shipping_address,
      shipping_city,
      shipping_country,
      shipping_phone,
      discount_code,
      discount_value,
      order_by,
      order_on,
      id,
    } = orderForm;

    try {
      const EditOrderQuery = `UPDATE orders SET 
        name =$1,
        email=$2,
        address=$3,
        city=$4,
        country=$5,
        phone=$6,
        payment_id=$7,
        mode_of_payment=$8,
        shipping_address=$9,
        shipping_city=$10,
        shipping_country=$11,
        shipping_phone=$12,
        discount_code=$13,
        discount_value=$14,
        order_by=$15,
        order_on=$16
        WHERE id=$17
         Returning *`;

      const updatedOrder = await client.query(EditOrderQuery, [
        name,
        email,
        address,
        city,
        country,
        phone,
        payment_id,
        mode_of_payment,
        shipping_address,
        shipping_city,
        shipping_country,
        shipping_phone,
        discount_code,
        discount_value,
        order_by,
        order_on,
        id,
      ]);

      console.log(updatedOrder?.rowCount, "1 Order updated");
      res.status(200).json({
        message: "Orders Updated ",
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = {
  FetchAllOrders,
  FetchOrderById,
  CreateNewOrder,
  DeleteOrder,
  UpdateOrder,
};
