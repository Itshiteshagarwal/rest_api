const express = require('express');
const router = express.Router();
const CartItem = require('../model/add_cart');
const cors = require('cors'); 

router.use(cors({
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'], // Add 'Authorization' to the allowedHeaders
}));
// Middleware to handle user authentication
const authenticateUser = (req, res, next) => {
  // Assuming the username is stored in the request object after authentication
  const { username } = req;

  // Perform user authentication here (e.g., check the username against the database or JWT)
  // For simplicity, we will assume the user is authenticated by checking if the username exists.
  if (!username) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Attach the authenticated username to the request object for later use
  req.username = username;
  next();
};

router.delete('/api/remove-item', authenticateUser, async (req, res) => {
  const { productName, username } = req.body;

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
