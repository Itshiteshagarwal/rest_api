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
    // Find the cart item by productName and the associated username
    const cartItem = await CartItem.findOne({ username });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart not found for the user' });
    }

    // Find the product index with the matching productName in the cart's products array
    const productIndex = cartItem.products.findIndex(
      (product) => product.productName === productName
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // Remove the product from the products array using splice method
    cartItem.products.splice(productIndex, 1);

    // Save the updated cart item
    await cartItem.save();

    res.json({ message: 'Item deleted from cart successfully' });
  } catch (error) {
    console.error('Error while deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item from cart' });
  }
});

module.exports = router;
