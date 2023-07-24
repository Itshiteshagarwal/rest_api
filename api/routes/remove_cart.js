const express = require('express');
const router = express.Router();
const CartItem = require('../model/add_cart');


router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Specify the allowed methods for CORS
  next();
});


// Middleware to handle user authentication
const authenticateUser = (req, res, next) => {
  // Assuming the username is stored in the request object after authentication
  const { username } = req;

  // Perform user authentication here (e.g., check the username against the database or JWT)
  // For simplicity, we will assume the user is authenticated by checking if the username exists.
  if (!username) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Attach the authenticated username to the request object for later use
  req.username = username;
  next();
};

router.delete('/remove-item', authenticateUser, (req, res) => {
  const productName = req.body.productName;
  const username = req.username;

  // Find the cart item by productName and the associated username and remove it
  CartItem.findOneAndDelete({ productName, username })
    .then(removedItem => {
      if (!removedItem) {
        return res.status(404).json({ error: 'Item not found in cart' });
      }

      res.json({ message: 'Item deleted from cart successfully' });
    })
    .catch(error => res.status(500).json({ error: 'Failed to delete item from cart' }));
});

module.exports = router;
