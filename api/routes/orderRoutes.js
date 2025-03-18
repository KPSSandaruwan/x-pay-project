module.exports = function (app) {
  const orderController = require("../controllers/orderController");

  app.post("/orders", orderController.createOrder);
  app.get("/orders", orderController.getAllOrders);
  app.get("/orders/:id", orderController.getSingleOrder);
  app.delete("/orders/:id", orderController.deleteSingleOrder);
  app.post("/process-next-order", orderController.processNextOrder);
};