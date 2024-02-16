const user_model = require("../model/userModel");
const { generateCode, compare } = require("../util/code");
const { generateToken } = require("../util/token");
const Validator = require("../util/validator");
const { comparePassword } = require("../util/password");
const { sendEmail, resendMail } = require("../util/email");

module.exports = {
  createAccount: async (req, res, next) => {
    try {
      Validator(req);
      const { email, password, lastName, firstName } = req.body;
      const user = new user_model({
        email: email.trim(),
        password: password.trim(),
        lastName: lastName.trim(),
        firstName: firstName.trim(),
      });
      const code = generateCode();
      user.code = code;
      const token = generateToken({
        email,
        id: user.id,
      });
      await sendEmail(user.email, code);
      await user.save();
      res.cookie("session", token);
      res.status(201).json({ message: "user created", token });
    } catch (error) {
      if (error.field) {
        return next(error);
      }
      res.status(500).json({ message: error.message });
    }
  },
  loginUser: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      Validator(req, res, next);
      const user = await user_model.findOne({
        email: email.trim(),
        type: "normal",
      });
      if (!user) {
        return next({ message: "Invalid Credentials" });
      }
      const match = await comparePassword(password.trim(), user.password);
      if (!match) {
        return next({ message: "Invalid Credentials" });
      }
      const token = generateToken({
        email: user.email,
        id: user.id,
      });
      if (req.session) {
        req.session.jwt = token;
      }
      res.cookie("session", token);
      res.status(200).json({ status: "success" });
    } catch (error) {
      if (error.field) {
        return next(error);
      }
      res.status(500).json({ message: error.message });
    }
  },
  verifyAcc: async (req, res, next) => {
    try {
      Validator(req);
      const { code } = req.body;
      const user = await user_model.findById(req.user.id);
      if (!user) {
        return next({ message: "Account not found" });
      }
      const isMatch = await compare(user.code, code);
      if (!isMatch) {
        return next({
          message: "incorrect code, request a new code to continue",
        });
      }
      user.verified = true;
      delete user.code;
      await user.save();
      res.status(202).json({ message: "success" });
    } catch (error) {
      if (error.field) {
        return next(error);
      }
      res.status(500).json({ message: error.message });
    }
  },
  resendlink: async (req, res, next) => {
    try {
      const user = await user_model.findById(req.user.id);
      if (!user) {
        return next({ message: "Account not found" });
      }
      const code = generateCode();
      user.code = code;
      await resendMail(user.email, code);
      await user.save();
      res.status(200).json({ message: "Mail sent" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  resetPasswordActive: async (req, res, next) => {
    try {
      const { oldpassword, newpassword } = req.body;
      Validator(req);
      const user = await user_model.findOne({ _id: req.id });
      if (!user) {
        return next({ message: "Account not found" });
      }
      const match = await comparePassword(oldpassword, user.password);
      if (!match) {
        return next({ message: "old password does not match" });
      }
      user.password = newpassword;
      await user.save();
      res.status(200).json({ status: "success" });
    } catch (error) {
      if (error.field) {
        return next(error);
      }
      res.status(500).json({ message: error.message });
    }
  },
  forgotPasswordCode: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await user_model.findOne({ email: email.trim() });
      if (!user) {
        return next({ message: "Account not found" });
      }
      const code = generateCode();

      user.code = code;
      //send code as mail again
      await resendMail(email, code);
      await user.save();
      res.status(200).json({ message: "code sent" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await user_model
        .findOne({ email: req.user.email })
        .select("-password")
        .select("-code")
        .select("-createdAt")
        .select("-updatedAt")
        .select("-verified");
      if (!user) {
        return next({ message: "Account not found" });
      }
      res.status(200).json({ message: user });
    } catch (error) {
      res.status(200).json({ message: error.message });
    }
  },
  resetPasswordOffline: async (req, res, next) => {
    try {
      Validator(req);
      const { email, password, confirm_password } = req.body;
      const user = await user_model.findOne({ email: email.trim() });
      if (!user) {
        return next({ message: "user not found try again later" });
      }
      user.password = password;
      await user.save();
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      if (error.field) {
        return next(error);
      }
      res.status(500).json({ message: error.message });
    }
  },
  logout: async (req, res, next) => {
    try {
      const user = await user_model.findById(req.user.id);
      if (!user) {
        return next({ message: "Please try again later" });
      }
      res.clearCookie("session");
      res.status(200).json({ message: "logout successful" });
    } catch (error) {}
  },
  deleteAccount: async (req, res, next) => {
    try {
      const user = await user_model.findById(req.user.id);
      if (!user) {
        return next({ message: "please try again later, user not found" });
      }
      await user_model.deleteOne({ _id: req.user.id });
      res.clearCookie("session");
      res.status(200).json({ message: "account deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  failureOauthrizeGoogle: async (req, res, next) => {
    try {
      res.status(200).json({ message: "Authentication not successfull" });
    } catch (error) {
      res.status(200).json({ message: error.message });
    }
  },
  successOauthrizeGoogle: async (req, res, next) => {
    try {
      if (!req.user) {
        return next({ message: "Please try again" });
      }
      let { givenName: firstName, familyName: lastName } = req.user.name;

      let user = await user_model.findOne({
        firstName,
        type: "oauth",
        lastName,
      });
      if (user) {
        const token = generateToken({
          email: user.email,
          id: user.id,
        });
        if (req.session) {
          req.session.jwt = token;
        }
        res.cookie("session", token);
        return res.status(200).json({ status: "success", token });
      }
      const email = new Date().getTime().toString();
      user = new user_model({
        email: email,
        lastName,
        firstName,
        type: "oauth",
      });
      const code = generateCode();
      user.code = code;
      token = generateToken({
        email,
        id: user.id,
      });
      // await sendEmail(user.email, code);
      await user.save();
      res.cookie("session", token);
      res.status(201).json({ message: "user created", token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateAccount: async (req, res, next) => {
    try {
      const { email, firstName, lastName } = req.body;
      Validator(req);
      let user = await user_model.findOne({ email });
      if (user) {
        return next({
          message: "email is in use by another user, try something else",
        });
      }
      user = await user_model.findOne({ _id: req.user.id });
      if (user.type == "oauth") {
        user.email = email;
        const code = generateCode();
        await sendEmail(email, code);
      } else {
        user = {
          ...user,
          firstName,
          lastName,
        };
      }
      await user.save();
      res.status(200).json({ message: "account updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
