const cart_model = require("../model/cartModel");
const path = require ("path");
const order_model = require("../model/orderModel");



// Defines methods for adding to CArt
user_schema.methods.addToCart = function (product) {
    let cart = this.cart;

    if (cart.items.length == 0){
        cart.items.push({productId: product._id, qty:1});
        cart.totalPrice = product.price;
    } else {
        const isExisting = cart.items.findIndex(objInItems => {
            return new String (objInItems.productId).trim() == new String(product._id).trim();
        });
        if (isExisting == -1) {
            cart.items.push({productId: product._id, qty: 1});
            cart.totalPrice = product.price;
        } else{
            existingProductInCart = cat.items[isExisting];
            existingProductInCart.qty += 1;
            cart.totalPrice += product.price;
        }

    }
    console.log('User in schema', this);
    return this.save();
}

// Adds to CArt
function addToCart (req, res, next) {
    Product.findById(req.body.id)
.then(product => {
        req.user.addToCart(product);
        res.redirect('/');
    })
.then(); {
    res.redirect("/cart")
.catch(error =>
        console.log(error));
}}


// Defines methods for Removing From Cart
user_schema.methods.removeFromCart = function (productId) {
    const cart = this.cart;
    const isExisting = cart.items.findIndex(objInItems => 
      new String (objInItems.productId).trim() === new String(productId).trim());
    if (isExisting >= 0) {
        cart.items.splice(isExisting, 1);
        return this.save()
    }
}


// Remove from Cart
function removeFromCart (req, res, next) {
    req.user.removeFromCart(req.body.productId)
      .then(() => {
        res.redirect("/cart");
      }).catch(error =>
        console.log(error));
}





module.exports = {
    addToCart,
    removeFromCart}