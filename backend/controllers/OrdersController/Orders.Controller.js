const asyncHanlder = require("express-async-handler");
const db = require("../../config/dbConfig");

/* Fetch All Orders Details */

const FetchAllOrders = asyncHanlder(async (req, res) => {
  try {
    const ordersQuery = `SELECT o.*, u.name, u.email,u.phone, u.address, u.city, u.country FROM Orders o JOIN Users u ON o.user_id = u.id`;
    const getAllOrders = await db.query(ordersQuery);

    res.status(200).json({
      orders: getAllOrders?.rows,
      message: "All Orders Found ",
    });
  } catch (error) {
    console.log(error, "Error fetching Orders");
    res.status(500).json({ message: error.message });
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
      userID,
      shipping_address,
      shipping_city,
      shipping_country,
      shipping_phone,
      discount_code,
      discount_value,
      items, //Items will always be an array [{book_id,book_title}]
     
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
        order_on) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) Returning *`;

      const saveNewOrder = await db.query(createOrderQuery, [
        userID,
        shipping_address,
        shipping_city,
        shipping_country,
        shipping_phone,
        discount_code,
        discount_value,
        JSON.stringify(items), // Serialize items to JSON string
        order_on,
      ]);

      console.log(saveNewOrder?.rowCount, "1 Order Created");
      res.status(200).json({
        result: saveNewOrder?.rows[0],
        message: "Order Created Successfully",
      });
    } catch (error) {
      // console.log(error);
      res
        .status(400)
        .json({ message: error.message || "Something went wrong " });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/* Delete Order */

const DeleteOrder = asyncHanlder(async (req, res) => {
  const { order_id } = req.params;
  try {
    const deleteOrderQuery = `DELETE FROM orders WHERE id =$1`;

    await db.query(deleteOrderQuery, [order_id]);

    // console.log(deleteOrderdetails?.rowCount);
    res.status(200).json({
      message: "Deleted Order details successfully",
    });
  } catch (error) {
    console.log(error, "Delete order details failed");
    res
      .status(500)
      .json({ message: "Error deleting Order Details", error: error });
  }
});

/* Update Order */

const UpdateOrder = asyncHanlder(async (req, res) => {
  try {
    const { orderForm } = req.body;
    // console.log(orderForm);

    const {
      shipping_address,
      shipping_city,
      shipping_country,
      shipping_phone,
      items, //Items will always be an array [{id,title}]
      id,
    } = orderForm;

    try {
      const EditOrderQuery = `UPDATE orders SET 
        shipping_address=$1,
        shipping_city=$2,
        shipping_country=$3,
        shipping_phone=$4,
        items=$5
        WHERE 
        id=$6
         Returning *`;

      const updatedOrder = await db.query(EditOrderQuery, [
        shipping_address,
        shipping_city,
        shipping_country,
        shipping_phone,
        JSON.stringify(items), //Items will always be an array [{id,title}]Serialize items to JSON string
        id,
      ]);

      console.log(updatedOrder?.rowCount, "1 Order updated");
      res.status(200).json({
        message: "Orders Updated ",
      });
    } catch (error) {
      console.log(error, "DB Error Update Order failed");
      res.status(500).json({
        message: error.message || "DB Error: Failed to Update Orders",
        error: error,
      });
    }
  } catch (error) {
    console.log(error, "Error updating order failed ");
    res
      .status(500)
      .json({ message: "Server Error: Something went wrong", error: error });
  }
});

module.exports = {
  FetchAllOrders,
  FetchOrderById,
  CreateNewOrder,
  DeleteOrder,
  UpdateOrder,
};
