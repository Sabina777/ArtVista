const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

// Method to add a product to the cart
userSchema.methods.addToCart = function(product) {
  // Check if the product is already in the cart
  const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  // If the product is already in the cart, increment the quantity
  if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
      // If the product is not in the cart, add it with a quantity of 1
      updatedCartItems.push({
          productId: product._id,
          quantity: newQuantity
      });
  }
  // Update the cart with the updated items
  const updatedCart = {
      items: updatedCartItems
  };
  this.cart = updatedCart;
  // Save the user object to the database
  return this.save();
};

// Method to remove a product from the cart
userSchema.methods.removeFromCart = function(productId) {
  // Filter out the item with the specified productId from the cart
  const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
  });
  // Update the cart with the filtered items
  this.cart.items = updatedCartItems;
  // Save the user object to the database
  return this.save();
};

// Method to clear the cart
userSchema.methods.clearCart = function() {
  // Clear the cart by setting the items array to an empty array
  this.cart = { items: [] };
  // Save the user object to the database
  return this.save();
};


module.exports = mongoose.model('User', userSchema);
