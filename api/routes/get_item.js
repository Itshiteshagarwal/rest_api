const express = require('express');
const router = express.Router();
const cors = require('cors');
const Cart = require('../model/add_cart');

// Set appropriate headers to allow frontend access
router.use(cors({
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'userid'],
}));

// Middleware to handle user authentication
const authenticateUser = (req, res, next) => {
  const { userid } = req.headers; // Use 'userid' instead of 'userId' for consistency with the header key

  // Perform user authentication here (e.g., check the user ID against the database or JWT)
  // For simplicity, we will assume the user is authenticated by checking if userid exists.
  if (!userid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Attach the authenticated userid to the request object for later use
  req.userid = userid;
  next();
};

// Get the cart data
router.get('/cart_items', authenticateUser, async (req, res) => {
  const { userid } = req;

  try {
    // Check if the cart exists for the user
    const existingCart = await Cart.findOne({ userId: userid });

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
