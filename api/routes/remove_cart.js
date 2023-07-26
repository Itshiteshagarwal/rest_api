const express = require('express');
const router = express.Router();
const CartItem = require('../model/add_cart');


router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, username'); // Include 'username' in the allowed headers
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Specify the allowed methods for CORS
  next();
});

router.delete('/remove_cart', async (req, res) => {
  const { productName } = req.query; 
  const { username } = req.headers; 

  try {
    // cart item by productName and the associated username
    const cartItem = await CartItem.findOne({ username });

    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // specific product in the cart by productName
    const productToRemove = cartItem.products.find(product => product.productName === productName);

    if (!productToRemove) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    // If the quantity is greater than 1, decrement the quantity by 1
    if (productToRemove.quantity > 1) {
      productToRemove.quantity -= 1;
    } else {
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
