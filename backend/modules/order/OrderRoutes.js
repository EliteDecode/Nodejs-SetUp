const express = require("express");
const OrderRouter = express.Router();
const { createOrder, getAllOrders, getOrderById, UpdateOrderStatus, deleteOrder } = require("./orderController");
const { protectRoute } = require("../../middlewares/AuthMiddleware");

OrderRouter.post('/orders', createOrder);
OrderRouter.get('/orders', getAllOrders);
OrderRouter.get('/orders/:orderId', protectRoute, getOrderById);
OrderRouter.put('/orders/:orderId', protectRoute, UpdateOrderStatus);
OrderRouter.delete('/orders/:orderId', protectRoute, deleteOrder)

// export all the routes
module.exports = OrderRouter

