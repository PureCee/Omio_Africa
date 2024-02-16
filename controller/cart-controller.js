const product_model = require("../model/productModel");
const user_model = require("../model/userModel");

// Defines methods for adding to CArt
const AddToCart = async (req, res, next) => {
  try {
    const { id: product_id } = req.params;
    const product = await product_model.findOne({ _id: product_id });
    if (!product) {
      return next({ message: "Unable to add product to cart" });
    }
    const activeuser = await user_model.findOne({ _id: req.user.id });

    let cart = activeuser.carts;
    let dont = false;
    let totalPrice = activeuser.cart_price;
    if (cart.length == 0) {
      cart.push({ productId: product._id, qty: 1 });
      console.log("here first");
    } else {
      const isExisting = cart.findIndex((objInItems) => {
        return objInItems.productId.toString() === product._id.toString();
      });
      if (isExisting === -1) {
        cart = [...cart, { productId: product._id, qty: 1 }];
        console.log("here 2");
      } else {
        existingProductInCart = cart[isExisting];
        existingProductInCart.qty += 1;
        // cart[isExisting] += 1;
        console.log("here 3");
      }
    }
    totalPrice += product.price;
    activeuser.carts = cart;
    activeuser.cart_price = totalPrice;
    await activeuser.save();
    res.status(200).json({ message: "product added to cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Defines methods for Removing From Cart
const RemoveFromCart = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const activeuser = await user_model.findOne({ _id: req.user.id });
    const product = await product_model.findOne({ _id: productId });
    if (!product) {
      return next({ message: "Product not found" });
    }
    const cart = activeuser.carts;
    let totalPrice = activeuser.cart_price;
    const prodIndex = cart.findIndex(
      (objInItems) => objInItems.productId.toString() === productId.toString()
    );
    if (prodIndex == -1) {
      return next({ message: "product not in cart" });
    }
    if (prodIndex >= 0) {
      const cart_prod = cart[prodIndex];
      if (cart_prod.qty > 1) {
        cart_prod.qty -= 1;
        cart[prodIndex] = cart_prod;
      } else {
        cart.splice(prodIndex, 1);
      }
    }
    totalPrice -= product.price;
    activeuser.carts = cart;
    activeuser.cart_price = totalPrice;
    await activeuser.save();
    res.status(200).json({ message: "successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const viewCart = async (req, res, next) => {
  try {
    ("Product");
    const user = await user_model
      .findOne({ _id: req.user.id })
      .populate("carts.productId");
    const cart = user.carts;
    const total_price = user.cart_price;
    res.status(200).json({ cart, total_price });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  RemoveFromCart,
  AddToCart,
  viewCart,
};
