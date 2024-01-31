const user_model = require("../model/userModel");
const { validationResult } = require("express-validator");
const { generateCode } = require("../util/code");
const { generateToken } = require("../util/token");

module.exports = {
  createAccount: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let error = errors.errors[0].msg;
        return next({
          message: error,
          field: errors.errors[0].path,
          status: 400,
        });
      }
      const { email, password, lastName, firstName } = req.body;
      const user = new user_model({ email, password });
      const code = generateCode();
      user.code = code;
      await user.save();
      const token = generateToken({
        email,
        id: user.id,
      });
      
      res.status(201).json({ message: "user created", token });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  getUser: (req, res, next) => {
    res.status(200).json({ msg: req.currentUser });
  },
};
