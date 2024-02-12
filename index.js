// require packages needed
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieparser = require("cookie-parser");
const session = require("express-session");
// import required files
const user_route = require("./routes/user-route");
const product_route = require("./routes/product-route");
const order_route = require("./routes/order-route");

// set up express
const app = express();

// checking if port is avaliable
const port = process.env.PORT ? process.env.PORT : 4000;
app.set("trust proxy", true);
// use required middleware

app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(
  session({
    name: "omio",
    secret: process.env.ENVIRONMENT ? process.env.COOKIE_SECRET : "SaveBox",
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: process.env.ENVIRONMENT === "PRODUCTION" ? true : "auto",
      httpOnly: true,
    },
  })
);

app.use("/user", user_route);
app.use("/product", product_route);
app.use("/order", order_route);

//catch any error not availabe at code context
app.use((error, req, res, next) => {
  if (error.field) {
    return res
      .status(error.status ? error.status : 500)
      .json({ message: error.message, field: error.field });
  }
  res
    .status(error.status ? error.status : 500)
    .json({ message: error.message });
});

// start development server and connect to database
app.listen(port, () => {
  require("./mongoose/mongoose");
  console.log("Started on port " + port);
});
