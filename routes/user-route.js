const express = require("express");
const {
  createAccount,
  loginUser,
  verifyAcc,
  resendlink,
} = require("../controller/user-controller");
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

user_route.put(
  "/login",
  [
    check("email")
      .notEmpty()
      .withMessage("Email field is empty")
      .isEmail()
      .withMessage("Email is not a valid email address"),
    check("password")
      .notEmpty()
      .withMessage("Password field is required")
      .isLength({
        min: 5,
        max: 30,
      })
      .withMessage("Invalid Password, please check again"),
  ],
  loginUser
);

user_route.post(
  "/verify",
  Authorization,
  [
    check("code")
      .notEmpty()
      .withMessage("please enter code")
      .isLength({
        max: 6,
        min:4
      })
      .withMessage("Please enter your 6 digit code"),
  ],
  verifyAcc
);

user_route.put("/resend_link", Authorization, resendlink);

module.exports = user_route;
