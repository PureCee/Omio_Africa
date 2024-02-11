const { OrderItem, Order } = require("../model/orderModel");
const product_model = require("../model/productModel");

const createOrder = async (req, res, next) => {
  const { customer, customerAddress, orderItems, totalPrice } = req.body;
  try {
    console.log({ customer, customerAddress, orderItems, totalPrice });
    const orderItemsList = [];
    for (const orderItem of orderItems) {
      const product = await product_model.findById(orderItem.product);
      const order = await OrderItem.create({
        product: product,
        quantity: orderItem.quantity,
        price: orderItem.price,
      });
      orderItemsList.push(order);
    }
    const order = await Order.create({
      customer,
      customerAddress,
      orderItems: orderItemsList,
      totalPrice,
    });
    return res.status(201).json({ data: order });
  } catch (error) {
    return res.status(500).json({ message: "Internal system error" });
  }
};

const getOrder = async (req, res, next) => {
  const id = req.params.id;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ mesagge: "Order not found" });
    }
    return res.status(200).json({ data: order });
  } catch (error) {
    return res.status(500).json({ message: "Internal system error" });
  }
};

module.exports = {
  createOrder,
  getOrder,
};
