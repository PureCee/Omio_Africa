const express = require("express");
const { check } = require("express-validator");
const productController = require("../controller/product-controller");
const Authorization = require("../middleware/auth");

const product_route = express.Router();

product_route.get("/all", productController.getAllProducts);

product_route.post("/new", Authorization, productController.addProducts);

//search handler
product_route.get("/search", productController.searchAndQuery);

//update a particular product
product_route.put("/:id", Authorization, productController.updateProduct);
//delete a particular product
product_route.delete(
  "/:id",
  Authorization,
  productController.deleteProductByID
);

//   get five days deal
product_route.get("/five_days_deal", productController.getFiveDaysDeal);
// get 10 day deal

product_route.get("/ten_days_deal", productController.getTenDaysDeal);

product_route.get("/:id", Authorization, productController.getAllUserProduct);

module.exports = product_route;
