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

// Middleware to handle user authentication
const authenticateUser = (req, res, next) => {
  const { userId } = req.body;

  // Perform user authentication here (e.g., check the user ID against the database or JWT)
  // For simplicity, we will assume the user is authenticated by checking if userId exists.
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Attach the authenticated userId to the request object for later use
  req.userId = userId;
  next();
};

// Add a product to the cart
router.post('/add_to_cart', authenticateUser, async (req, res) => {
  const { userId, productId, productName, productPrice } = req.body;
  const quantity = 1; // You can get the quantity from the request if needed

  // Validation: Check if all required data is present
  if (!userId || !productId || !productName || !productPrice) {
    return res.status(400).json({ error: 'Missing required data' });
  }

  try {
    // Check if the cart already exists for the user
    const existingCart = await Cart.findOne({ userId });

    if (existingCart) {
      // Check if the product already exists in the cart
      const existingProductIndex = existingCart.products.findIndex((product) => product.productId === productId);

      if (existingProductIndex !== -1) {
        // If the product exists, update the quantity and the product price
        existingCart.products[existingProductIndex].quantity += quantity;
        existingCart.products[existingProductIndex].productPrice += productPrice; // Update the product price based on the quantity
      } else {
        // If the product does not exist, add it to the cart
        existingCart.products.push({
          productId,
          productName,
          productPrice,
          quantity,
        });
      }

      await existingCart.save();
      res.json({ message: 'Item added to the cart.', cart: existingCart });
    } else {
      // If the cart does not exist, create a new cart for the user
      const newCart = await Cart.create({
        userId,
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

// Get cart items for a user
router.get('/cart_items', authenticateUser, async (req, res) => {
  const { userId } = req;

  try {
    // Check if the cart exists for the user
    const existingCart = await Cart.findOne({ userId });

    if (existingCart) {
      res.json({ cart: existingCart });
    } else {
      res.json({ cart: { products: [] } }); // Return an empty cart if it doesn't exist for the user
    }
  } catch (error) {
    console.error('Error while fetching cart items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
