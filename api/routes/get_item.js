const express = require('express');
const router = express.Router();
const cors = require('cors');
const Cart = require('../model/add_cart');

// Set appropriate headers to allow frontend access
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

router.use(cors({
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'userId'],
}));




// Middleware to handle user authentication
const authenticateUser = (req, res, next) => {
  const { userId } = req.headers;

  // Perform user authentication here (e.g., check the user ID against the database or JWT)
  // For simplicity, we will assume the user is authenticated by checking if userId exists.
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID not provided in the headers.' });
  }

  // Attach the authenticated userId to the request object for later use
  req.userId = userId;
  next();
};

// Get the cart data
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
