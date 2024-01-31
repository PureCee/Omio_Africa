const express = require("express");
const { createAccount, getUser } = require("../controller/user-controller");
const user_route = express.Router();
const { check } = require("express-validator");
const user_model = require("../model/userModel");
const Authorization = require("../middleware/auth");

user_route.post(
  "/new_user",
  [
    check("email")
      .notEmpty()
      .withMessage("Email field is required")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .custom(async (val, _) => {
        const user = await user_model.findOne({ email: val });

        if (user) {
          throw new Error("Email is currently in use");
        }
        return false;
      })
      .withMessage("Email is currently in use"),
    check("password")
      .notEmpty()
      .withMessage("Password field is required")
      .isStrongPassword()
      .withMessage("Your password is not string enough"),
  ],
  createAccount
);

user_route.get("/me", Authorization, getUser);

module.exports = user_route;
