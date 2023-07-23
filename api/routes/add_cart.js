const express = require('express');
const router = express.Router();
const Cart = require('../model/add_cart');
const Product = require('../model/products');
const User = require('../model/user');

// Add a product to the cart
router.post('/api/cart', async (req, res) => {
  try {
    const { username, productName, quantity } = req.body;

    // Find the user in the user table
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the product exists in the database based on the product name
    const product = await Product.findOne({ name: productName });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find the user's cart or create a new cart if it doesn't exist
    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = new Cart({ user: user._id, products: [] });
    }

    // Check if the product is already in the cart
    const existingProductIndex = cart.products.findIndex(
      (item) => item.productId.toString() === product._id.toString()
    );
    if (existingProductIndex !== -1) {
      return res.status(400).json({ error: 'Product already exists in the cart' });
    }

    // Add the product with the given quantity to the cart
    cart.products.push({ productId: product._id, quantity });

    // Save the updated cart to the database
    const updatedCart = await cart.save();
    res.status(201).json({ message: 'Product added to cart', cart: updatedCart });
  } catch (err) {
    res.status(500).json({ error: 'Error adding product to cart', err });
  }
});

module.exports = router;
