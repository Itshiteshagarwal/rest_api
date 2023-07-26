const express = require('express');
const router = express.Router();
const Cart = require('../model/add_cart');

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Specify the allowed methods for CORS
  next();
});

// Middleware to handle user authentication
const authenticateUser = (req, res, next) => {
  const { username } = req.body;


  if (!username) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.username = username;
  next();
};

// Add a product to the cart
router.post('/add_to_cart', authenticateUser, async (req, res) => {
  const { username, productId, productName, productPrice, productImage } = req.body;
  const quantity = 1; 

  // Check if all required data is present
  if (!username || !productId || !productName || !productPrice || !productImage) {
    return res.status(400).json({ error: 'Missing required data' });
  }

  try {
    // user's cart or create a new one if it doesn't exist
    let userCart = await Cart.findOne({ username });

    if (!userCart) {
      userCart = await Cart.create({ username, products: [] });
    }

    // Check if the product already exists in the cart
    const existingProduct = userCart.products.find((product) => product.productName === productName);

    if (existingProduct) {
      existingProduct.quantity += quantity;
      existingProduct.productPrice += productPrice; 
    } else {
      
      userCart.products.push({
        username, 
        productId,
        productName,
        productPrice,
        productImage,
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
