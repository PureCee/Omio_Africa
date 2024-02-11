const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true,
  },
  customerAddress: {
    type: String,
    required: true,
  },
  orderItems: [OrderItemSchema],
  totalPrice: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = {
  OrderItemSchema,
  OrderSchema,
};
