const express = require('express');
const router = express.Router();
const CartItem = require('../model/add_cart');

// Enable CORS for all routes
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, username'); // Include 'username' in the allowed headers
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Specify the allowed methods for CORS
  next();
});

// API endpoint to delete an item from the cart by product name
router.delete('/remove_cart', async (req, res) => {
  const { productName } = req.body;
  const { username } = req.headers; // Get the 'username' from the request headers

  try {
    // Find the cart item by productName and the associated username and remove it
    const removedItem = await CartItem.findOneAndUpdate(
      { username },
      { $pull: { product: { productName } } },
      { new: true }
    );

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
