const mongoose = require("mongoose");

// Define a Schema
const Schema = mongoose.Schema;

// Define Product Schema
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
    expiry_date: {
      type: Date,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
      type: String,
    },
  },
  {
    // using timestaps covers for both createdA and updated At
    timestamps: true,
  }
);

module.exports = ProductSchema;
