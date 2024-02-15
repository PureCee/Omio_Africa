const express = require("express");
const path = require("path");
const cartController = require("../controller/cart-controller");
const Authorization = require("../middleware/auth");

const cart_route = express.Router();

cart_route.put("/add/:id", Authorization, cartController.AddToCart);

cart_route.put("/remove/:id", Authorization, cartController.RemoveFromCart);

cart_route.get("/view", Authorization, cartController.viewCart);

module.exports = cart_route;
