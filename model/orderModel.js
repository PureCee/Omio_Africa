const mongoose = require("mongoose");

const { OrderItemSchema, OrderSchema } = require("../schema/order-schema");
const Order = mongoose.model("Order", OrderSchema);
const OrderItem = mongoose.model("OrderItem", OrderItemSchema);

module.exports = {
  Order,
  OrderItem,
};
