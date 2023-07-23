const express = require('express');
const router = express.Router();
const Cart = require('../models/cart'); // Replace 'cart' with the appropriate model for your cart table

// Add a product to the cart
router.post('/api/add_to_cart', async (req, res) => {
  try {
    const { productId, productName, productPrice, quantity } = req.body;

    // Find the cart or create a new cart if it doesn't exist
    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ products: [] });
    }

    // Check if the product is already in the cart
    const existingProductIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (existingProductIndex !== -1) {
      return res.status(400).json({ error: 'Product already exists in the cart' });
    }

    // Add the product with the given quantity to the cart
    cart.products.push({ productId, productName, productPrice, quantity });

    // Save the updated cart to the database
    const updatedCart = await cart.save();
    res.status(201).json({ message: 'Product added to cart', cart: updatedCart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding product to cart' });
  }
});

module.exports = router;
