const express = require('express');
const router = express.Router();
const cors = require('cors');
const Cart = require('../model/add_cart');

// Set appropriate headers to allow frontend access
router.use(cors({
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'], // Remove 'userid' from allowedHeaders
}));

// Middleware to handle user authentication
const authenticateUser = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Assuming the authorization header value is the username
  const username = authorizationHeader;

  // Attach the authenticated username to the request object for later use
  req.username = username;
  next();
};

// Get the cart data
router.get('/cart_items', authenticateUser, async (req, res) => {
  const { username } = req;

  try {
    // Check if the cart exists for the user
    const existingCart = await Cart.findOne({ userId: username });

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
