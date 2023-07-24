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
  const { productName } = req.query; // Use query parameter to get the product name
  const { username } = req.headers; // Get the 'username' from the request headers

  try {
    // Find the cart item by productName and the associated username
    const cartItem = await CartItem.findOne({ username });

    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // Find the specific product in the cart by productName
    const productToRemove = cartItem.products.find(product => product.productName === productName);

    if (!productToRemove) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    // If the quantity is greater than 1, decrement the quantity by 1
    if (productToRemove.quantity > 1) {
      productToRemove.quantity -= 1;
    } else {
      // If the quantity is 1, remove the product from the products array
      cartItem.products = cartItem.products.filter(product => product.productName !== productName);
    }

    // Save the updated cart item
    await cartItem.save();

    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error while removing item:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

module.exports = router;
