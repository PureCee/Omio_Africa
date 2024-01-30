const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGOOSE)
  .then(() => {
    console.log("connection succesfully");
  })
  .catch((err) => {
    console.log(err.message);
  });
