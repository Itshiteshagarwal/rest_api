const express = require('express');
const router = express.Router();
const Cart = require('../model/add_cart');

// Set appropriate headers to allow frontend access
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Specify the allowed methods for CORS
  next();
});

// Get the cart data
router.get('/cart', async (req, res) => {
  try {
    // Find the cart document
    const cart = await Cart.findOne();

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // If the cart is found, return the cart data
    res.json({ cart });
  } catch (error) {
    console.error('Error while fetching cart data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
