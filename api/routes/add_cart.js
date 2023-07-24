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
    // Find the user's cart or create a new one if it doesn't exist
    let userCart = await Cart.findOne({ userId });

    if (!userCart) {
      userCart = await Cart.create({ userId, products: [] });
    }

    // Check if the product already exists in the cart
    const existingProductIndex = userCart.products.findIndex((product) => product.productId === productId);

    if (existingProductIndex !== -1) {
      // If the product exists, update the quantity and the product price
      userCart.products[existingProductIndex].quantity += quantity;
      userCart.products[existingProductIndex].productPrice += productPrice; // Update the product price based on the quantity
    } else {
      // If the product does not exist, add it to the cart
      userCart.products.push({
        userId, // Include the userId in the product entry
        productId,
        productName,
        productPrice,
        quantity,
      });
    }

    await userCart.save();
    res.json({ message: 'Item added to the cart.', cart: userCart });
  } catch (error) {
    console.error('Error while adding product to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
