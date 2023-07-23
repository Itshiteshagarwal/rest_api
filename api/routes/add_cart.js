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

// Add a product to the cart
router.post('/add_to_cart', async (req, res) => {
  const { productId, productName, productPrice } = req.body;
  const quantity = 1; // You can get the quantity from the request if needed

  // Validation: Check if all required data is present
  if (!productId || !productName || !productPrice) {
    return res.status(400).json({ error: 'Missing required data' });
  }

  try {
    // Check if the cart already exists for the user
    const existingCart = await Cart.findOne({ userId: 'replace_with_user_id' }); // Replace with the actual user ID, if available

    if (existingCart) {
      // If the cart exists, update the existing cart with the new product
      existingCart.products.push({
        productId,
        productName,
        productPrice,
        quantity,
      });

      await existingCart.save();
      res.json({ message: 'Item added to the cart.', cart: existingCart });
    } else {
      // If the cart does not exist, create a new cart
      const newCart = await Cart.create({
        userId: 'replace_with_user_id', // Replace this with the actual user ID, if available
        products: [{
          productId,
          productName,
          productPrice,
          quantity,
        }],
      });

      res.json({ message: 'Item added to the cart.', cart: newCart });
    }
  } catch (error) {
    console.error('Error while adding product to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
