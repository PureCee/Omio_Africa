const express = require("express");
const { check } = require("express-validator");
const productController = require("../controller/product-controller");
const Authorization = require("../middleware/auth");

const product_route = express.Router();

product_route.get("/all", productController.getAllProducts);

product_route.post("/new", Authorization, productController.addProducts);

//search handler
product_route.get("/search", productController.searchAndQuery);
// product_route.put(
//   "/:id",
//   UpdateProductValidationMW,
//   productController.updateProduct
// );

// product_route.delete("/:id", productController.deleteProductByID);

module.exports = product_route;
