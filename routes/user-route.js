const express = require("express");
const {
  createAccount,
  loginUser,
  verifyAcc,
  resendlink,
  resetPasswordActive,
  forgotPasswordCode,
  getUser,
  resetPasswordOffline,
  logout,
  deleteAccount,
  failureOauthrizeGoogle,
  successOauthrizeGoogle,
} = require("../controller/user-controller");
const user_route = express.Router();
const { check } = require("express-validator");
const user_model = require("../model/userModel");
const Authorization = require("../middleware/auth");

user_route.post(
  "/new_user",
  [
    check("firstName")
      .notEmpty()
      .withMessage("Please enter your first name")
      .isLength({
        min: 3,
        max: 50,
      })
      .withMessage("Please enter a name within 3 to 50 characters"),
    check("lastName")
      .notEmpty()
      .withMessage("Please enter your last name")
      .isLength({
        min: 3,
        max: 50,
      })
      .withMessage("Please enter a name within 3 to 50 characters"),
    check("email")
      .notEmpty()
      .withMessage("Email field is required")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .custom(async (val, _) => {
        const user = await user_model.findOne({ email: val, type: "normal" });
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
      .withMessage("Your password is not strong enough"),
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
        min: 4,
      })
      .withMessage("Please enter your 6 digit code"),
  ],
  verifyAcc
);
// resend code while active
user_route.put("/resend_link", Authorization, resendlink);

// reset password while active
user_route.post(
  "/reset_active_password",
  Authorization,
  [
    check("oldpassword").notEmpty().withMessage("please enter old password"),
    check("newpassword").notEmpty().withMessage("please enter new passowrd"),
  ],
  resetPasswordActive
);

user_route.put(
  "/reset_password",
  [
    check("email")
      .notEmpty()
      .withMessage("Email field is required")
      .isEmail()
      .withMessage("Please enter a valid email address"),
  ],
  forgotPasswordCode
);

user_route.get("/me", Authorization, getUser);

user_route.post(
  "/password",
  [
    check("email")
      .notEmpty()
      .withMessage("email field is required")
      .isEmail()
      .withMessage("enter a valid emailaddress"),
    check("password")
      .notEmpty()
      .withMessage("please enter password")
      .isStrongPassword()
      .isLength({ min: 7 })
      .withMessage("Password character must be greater than 7 characters")
      .withMessage(
        "your password must contain a capital letter and special character"
      ),
    check("confirm_password")
      .notEmpty()
      .withMessage("Please confirm your password")
      .custom((data, { req }) => {
        if (req.body.password !== data) {
          return false;
        }
        return true;
      })
      .withMessage("Passwords are not equal"),
  ],
  resetPasswordOffline
);
//logout
user_route.put("/logout", Authorization, logout);

//delete account
user_route.delete("/account", Authorization, deleteAccount);

user_route.get("/failed", failureOauthrizeGoogle);
user_route.get("/success", successOauthrizeGoogle);

module.exports = user_route;
