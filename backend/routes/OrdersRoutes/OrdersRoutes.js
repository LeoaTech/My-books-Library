const express = require("express");
const {
  FetchAllOrders,
  FetchOrderById,
} = require("../../controllers/OrdersController/Orders.Controller");
const {
  checkRole,
  checkPermissions,
} = require("../../middleware/authorization");
const { checkAuth } = require("../../middleware/authMiddleware");

const router = express.Router();

// Verify Authentication
router.use(checkAuth);

// Fetch All Orders

router.get("/", checkRole, checkPermissions(["READ ORDER"]), FetchAllOrders);

// Fetch Order by Order Id
router.get(
  "/order",
  checkRole,
  checkPermissions(["READ ORDER"]),
  FetchOrderById
);

module.exports = router;
