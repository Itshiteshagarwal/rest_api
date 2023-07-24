const express = require('express');
const router = express.Router();
const CartItem = require('../model/add_cart');

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Specify the allowed methods for CORS
  next();
});

// Middleware to verify user authentication based on username
const authenticateUser = (req, res, next) => {
  const { username } = req.headers;

  if (!username) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Here, you can perform user authentication by checking the username against your database or any other means.
  // For simplicity, we will assume the user is authenticated if the username is provided.

  // Attach the authenticated username to the request object for later use
  req.username = username;
  next();
};

// API endpoint to delete an item from the cart by product name for a specific authenticated user
router.delete('/api/remove-item', authenticateUser, async (req, res) => {
  const { productName } = req.body;
  const username = req.username;

  try {
    // Find the cart item by productName and the associated username and remove it
    const removedItem = await CartItem.findOneAndDelete({ productName, username });

    if (!removedItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    res.json({ message: 'Item deleted from cart successfully' });
  } catch (error) {
    console.error('Error while deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item from cart' });
  }
});

module.exports = router;
