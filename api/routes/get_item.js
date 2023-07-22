const express = require('express');
const router = express.Router();
const Cart = require('../model/add_cart');

// Get cart items
router.get('/cart', (req, res) => {
  Cart.find()
    .then(cartItems => res.json(cartItems))
    .catch(error => res.status(500).json({ error: 'Failed to fetch cart items' }));
});

module.exports = router;
