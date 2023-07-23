const express = require('express');
const router = express.Router();
const Cart = require('../model/add_cart'); // Replace 'cart' with the appropriate model for your cart table

// Set appropriate headers to allow frontend access
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Specify the allowed methods for CORS
  next();
});

// Add a product to the cart
router.post('/api/add_to_cart', async (req, res) => {
  try {
    const { productId, productName, productPrice, quantity } = req.body;

    // You might need to change this logic based on your use case.
    // If you have a user authentication system, you should associate the cart with the user.
    // For now, we are finding the cart without any filters, which will give you the first cart in the collection.
    let cart = await Cart.findOne();

    if (!cart) {
      // If no cart is found, create a new cart with an empty products array.
      cart = new Cart({ products: [] });
    }

    // Check if the product is already in the cart
    const existingProductIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (existingProductIndex !== -1) {
      return res.status(400).json({ error: 'Product already exists in the cart' });
    }

    // Add the product with the given quantity to the cart
    cart.products.push({ productId, productName, productPrice, quantity });

    // Save the updated cart to the database
    const updatedCart = await cart.save();

    res.status(201).json({ message: 'Product added to cart', cart: updatedCart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding product to cart' });
  }
});

module.exports = router;
