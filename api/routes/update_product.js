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

// API endpoint to update the product quantity in the cart by product name
router.put('/update_quantity', async (req, res) => {
  const { productName, quantity } = req.body;
  const { username } = req.headers; // Get the 'username' from the request headers

  try {
    // Find the cart item by productName and the associated username and update the quantity
    const updatedCartItem = await CartItem.findOneAndUpdate(
      { username, 'products.productName': productName },
      { $set: { 'products.$.quantity': quantity } },
      { new: true }
    );

    if (!updatedCartItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // Recalculate the price based on the updated quantity
    updatedCartItem.products.forEach((product) => {
      if (product.productName === productName) {
        product.productPrice = product.productPrice * quantity;
      }
    });

    await updatedCartItem.save();

    res.json({ message: 'Product quantity updated successfully', updatedCartItem });
  } catch (error) {
    console.error('Error while updating quantity:', error);
    res.status(500).json({ error: 'Failed to update product quantity' });
  }
});

module.exports = router;
