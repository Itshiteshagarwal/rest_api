const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Route to add a product to the cart
router.post('/api/cart', async (req, res) => {
  try {
    const { productId, productName, productPrice, productImage } = req.body;
    const userId = 'your_user_id'; // Replace this with the user ID of the logged-in user (you can get this from your authentication mechanism)

    // Check if the product exists in the database based on the product ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find the user's cart or create a new cart if it doesn't exist
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // Add the product to the cart
    cart.products.push(product);

    // Save the updated cart to the database
    const updatedCart = await cart.save();
    res.status(201).json({ message: 'Product added to cart', cart: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding product to cart' });
  }
});

module.exports = router;
