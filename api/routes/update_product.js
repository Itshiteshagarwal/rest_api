const express = require('express');
const router = express.Router();
const Cart = require('../model/add_cart');


router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Specify the allowed methods for CORS
  next();
});


router.patch('/update_quantity_by_name', async (req, res) => {
  const { productName, quantity } = req.body;
  const { username } = req.headers; // Get the 'username' from the request headers

  try {
    const cartItem = await Cart.findOne({ username, 'products.productName': productName });

    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    cartItem.products.forEach((product) => {
      if (product.productName === productName) {
        product.quantity = quantity;

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
