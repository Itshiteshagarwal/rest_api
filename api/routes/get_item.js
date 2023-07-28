const express = require('express');
const router = express.Router();
const cors = require('cors'); 
const Cart = require('../model/add_cart');


router.use(cors({
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'], // Add 'Authorization' to the allowedHeaders
}));

const authenticateUser = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const username = authorization;


  req.username = username;
  next();
};

router.get('/get_cart_items', authenticateUser, async (req, res) => {
  const { username } = req;

  try {
    const existingCart = await Cart.findOne({ username });

    if (existingCart) {
      res.json({ cart: existingCart });
    } else {
      res.json({ cart: { products: [] } }); 
    }
  } catch (error) {
    console.error('Error while fetching cart items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
