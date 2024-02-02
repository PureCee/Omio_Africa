const mongoose = require("mongoose");

const product_schema = require("../schema/products-schema");

const product_model = mongoose.model("Product", product_schema);

module.exports = product_model;
