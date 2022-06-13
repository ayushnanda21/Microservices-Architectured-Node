//acquirng router
const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//importing order model
const Order = require("../models/Order");
const OrderItem = require("../models/Order-Item");
const OrdersController = require("../controllers/orderController");

//creating order
router.post("/", OrdersController.orderCreate);

//getting all orders
router.get("/", OrdersController.getallOrders);

//getting particular order
router.get("/:id", OrdersController.getorderId);

// update status of order
router.post("/:id", verifyTokenAndAdmin, OrdersController.updateOrder);

//delete order
router.delete("/:id", OrdersController.deleteOrder);

//total sales
router.get(
  "/get/totalsales",
  verifyTokenAndAdmin,
  OrdersController.getOrderSales
);

//order count
router.get("/get/count", OrdersController.getOrderCount);

//getting our order in front end for user display
router.get("/get/userorders/:userid", OrdersController.getorderforUserDisplay);

module.exports = router;
