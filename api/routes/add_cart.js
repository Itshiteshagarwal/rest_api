const express = require('express');
const router = express.Router();
const Cart = require('../model/add_cart');
const Product = require('../model/products');
const mongoose = require('mongoose');

// Add a product to the cart
router.post('/api/cart', async (req, res) => {
  try {
    const { username, productId, quantity } = req.body;

    // Check if the product exists in the database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find the user's cart or create a new cart if it doesn't exist
    let cart = await Cart.findOne({ username });
    if (!cart) {
      cart = new Cart({ username, products: [] });
    }

    // Check if the product is already in the cart
    const existingProductIndex = cart.products.findIndex((item) => item.productId.toString() === productId);
    if (existingProductIndex !== -1) {
      // If the product is already in the cart, update the quantity
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // If the product is not in the cart, add it with the given quantity
      cart.products.push({ productId: mongoose.Types.ObjectId(productId), quantity });
    }

    // Save the updated cart to the database
    const updatedCart = await cart.save();
    res.status(201).json({ message: 'Product added to cart', cart: updatedCart });
  } catch (err) {
    res.status(500).json({ error: 'Error adding product to cart', err });
  }
});

module.exports = router;
