const { validationResult } = require("express-validator");
const Validator = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = errors.errors[0].msg;
    throw {
      message: error,
      field: errors.errors[0].path,
      status: 400,
    };
  }
};
module.exports = Validator;
