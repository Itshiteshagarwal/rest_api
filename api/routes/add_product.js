const express = require('express');
const router = express.Router();
const Product = require('../models/products');

// Cart to store added products
let cart = [];

// Middleware to handle CORS
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Add a product to the cart
router.post('/api/add-to-cart', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if the product with the given productId exists in the database
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find the product in the cart, if already added
    const cartProductIndex = cart.findIndex((item) => item.productId === productId);

    if (cartProductIndex !== -1) {
      // Product already exists in the cart, update the quantity
      cart[cartProductIndex].quantity += quantity;
    } else {
      // Product not in the cart, add it with the specified quantity
      cart.push({
        productId,
        name: product.name,
        price: product.price,
        quantity,
      });
    }

    res.status(200).json({ message: 'Product added to cart successfully', cart });
  } catch (err) {
    res.status(500).json({ error: 'Error adding product to cart', err });
  }
});

// Fetch all cart products
router.get('/api/cart-products', (req, res) => {
  res.status(200).json({ cart });
});

module.exports = router;
