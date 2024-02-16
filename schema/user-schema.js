const mongoose = require("mongoose");
const { hashpassword } = require("../util/password");
const Schema = mongoose.Schema;

const user_schema = new Schema(
  {
    email: {
      required: true,
      type: String,
    },
    password: {
      type: String,
      min: 8,
      required: false,
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
        ref: "Product",
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    carts: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        qty: { type: Number },
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["oauth", "normal"],
      default: "normal",
    },
    cart_price: {
      type: Number,
      default: 0,
    },
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
  if (this.isModified("code")) {
    const hashedCode = await hashpassword(this.get("code"));
    this.set("code", hashedCode);
  }
  next();
});

module.exports = user_schema;
