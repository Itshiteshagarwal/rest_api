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

// API endpoint to update the product quantity by product name
router.patch('/update_quantity_by_name', async (req, res) => {
  const { productName, quantity } = req.body;
  const { username } = req.headers; // Get the 'username' from the request headers

  try {
    // Find the cart item by productName and the associated username
    const cartItem = await Cart.findOne({ username, 'products.productName': productName });

    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // Update the product quantity
    cartItem.products.forEach((product) => {
      if (product.productName === productName) {
        product.quantity = quantity;
        // Update the product price based on the new quantity (if required)
        // product.productPrice = product.productPrice * quantity;
      }
    });

    await cartItem.save();
    res.json({ message: 'Quantity updated successfully', cart: cartItem });
  } catch (error) {
    console.error('Error while updating quantity:', error);
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});

module.exports = router;
