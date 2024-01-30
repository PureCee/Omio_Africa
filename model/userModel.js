const mongoose = require("mongoose");

const user_schema = require("../schema/user-schema");

const user_model = mongoose.model("User", user_schema);

module.exports = user_model;
