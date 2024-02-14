const mongoose = require("mongoose");

const cart_controller = require ("../controller/cart-controller");
const cart_model = mongoose.model("Cart", cart_controller);

module.exports = cart_model;