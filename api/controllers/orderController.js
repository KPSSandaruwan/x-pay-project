const orderStatus = require("../enums/orderStatus");
const { orders, orderQueue } = require("../models/orderModel");
const availableProducts = require("../models/productModel");
const { v4: uuidv4 } = require("uuid");

exports.createOrder = (req, res) => {
  try {
    const { customer, requestProducts } = req.body;
    if (
      !customer ||
      !requestProducts ||
      !Array.isArray(requestProducts) ||
      requestProducts.length === 0
    ) {
      return res.status(400).json({ success: false, message: "Invalid order data" });
    }

    for (const item of requestProducts) {
      const product = availableProducts.find((p) => p.name === item.name);
      if (!product || product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}`
        });
      }
    }

    requestProducts.forEach((item) => {
      let product = availableProducts.find((p) => p.name === item.name);
      product.quantity -= item.quantity;
    });

    const newOrder = {
      id: uuidv4(),
      customer,
      requestProducts,
      status: orderStatus.PENDING
    };

    orders.push(newOrder);
    orderQueue.push(newOrder.id);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.getAllOrders = (req, res) => {
  try {
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Orders fetch successfully",
      orders: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.getSingleOrder = (req, res) => {
  try {
    const requestId = req.params.id;
    if (!requestId) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    const order = orders.find((o) => o.id === requestId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Order found",
      order: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.deleteSingleOrder = (req, res) => {
  try {
    const requestId = req.params.id;
    if (!requestId) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    const order = orders.find((o) => o.id === requestId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    order.status = orderStatus.CANCELLED;
    res.status(200).json({
      success: true,
      message: "Order canceled Successfully!",
      order: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.processNextOrder = (req, res) => {
  try {
    if (orderQueue.length === 0) {
      return res.status(400).json({ success: false, message: "No orders in queue" });
    }

    const nextOrderId = orderQueue.shift();
    const order = orders.find((o) => o.id === nextOrderId);
    if (order) {
      order.status = orderStatus.PROCESSED;
      res
        .status(200)
        .json({ success: true, message: "Order processed", order: order });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
