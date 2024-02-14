const express = require("express");
const path = require ("path");
const cartController = require ("../controller/cart-controller");

const cart_route = express.Router();

cart_route.post("/add-to-cart", cartController.addToCart);

cart_route.delete("/remove-from-cart", cartController.removeFromCart);


module.exports = cart_route