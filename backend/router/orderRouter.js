const express = require("express");
const {
  createNewOrder,
  getSingleOrder,
  getMyAllOrders,
  getAllUserOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controller/orderController");
const { isAuthenticatedUser, authRole } = require("../middleware/auth");
const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, createNewOrder);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, getMyAllOrders);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authRole("admin"), getAllUserOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authRole("admin"), updateOrderStatus)
  .delete(isAuthenticatedUser, authRole("admin"), deleteOrder);

module.exports = router;
