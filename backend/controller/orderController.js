const handleAsyncError = require("../middleware/handleAsyncError");
const errorHandaler = require("../utils/errorHandaler");
const Order = require("../models/orderSchema");
const { updateProductStock } = require("../utils/updateProductStock");

// Create User New Order
exports.createNewOrder = handleAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    textPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    textPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// Get single order

exports.getSingleOrder = handleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new errorHandaler("Order items not found on this id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get my all orders

exports.getMyAllOrders = handleAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  if (!orders) {
    return next(new errorHandaler("Order not found on this user", 400));
  }

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get all user orders -- Admin

exports.getAllUserOrders = handleAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// Update order status -- Admin

exports.updateOrderStatus = handleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new errorHandaler("Order not found on this id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new errorHandaler("Order already devlivered", 400));
  }

  order.orderItems.forEach(async (order) => {
    await updateProductStock(order.product, order.quintity);
  });

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(201).json({
    success: true,
    message: "Order Devliverd Successfully",
  });
});

// Delete Order -- Admin

exports.deleteOrder = handleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new errorHandaler("Order not found on this id", 404));
  }
  await order.remove();

  res.status(200).json({
    success: true,
    message: "Order Delete Successfully",
  });
});
