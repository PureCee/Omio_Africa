const mongoose = require("mongoose");
const { hashpassword } = require("../util/password");
const Schema = mongoose.Schema;

const user_schema = new Schema(
  {
    email: {
      required: true,
      type: String,
      unique: true,
    },
    password: {
      required: true,
      type: String,
      min: 8,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    code: {
      type: String,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Products",
      },
      {
        type: Schema.Types.ObjectId,
        ref: "Products",
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Products",
      },
    ],
    carts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Products",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret, options) {
        delete ret.password;
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

user_schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashed = await hashpassword(this.get("password"));
    this.set("password", hashed);
  }
  next();
});

module.exports = user_schema;
