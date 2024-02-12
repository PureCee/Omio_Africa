const express = require("express");
const orderController = require("../controller/order-controller");
const Authorization = require("../middleware/auth");
const order_route = express.Router();

order_route.post("/", orderController.createOrder);
order_route.get("/:id", orderController.getOrder);

module.exports = order_route;
