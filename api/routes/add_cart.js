const express = require('express');
const router = express.Router();
const Cart = require('../model/add_cart');

router.post('/cart', (req, res) => {
  const { productId, name, price } = req.body;
  const quantity = 1; // Set the base quantity as one

  // Check if the item already exists in the cart
  Cart.findOne({ productId })
    .then(existingItem => {
      if (existingItem) {
        // Item already exists, increase the quantity by one and update the price
        existingItem.quantity += quantity;
        existingItem.price = price * existingItem.quantity;
        return existingItem.save();
      }

      // Item does not exist, add it to the cart with the base quantity and price
      const newItem = new Cart({
        productId,
        name,
        price: price * quantity,
        quantity
      });

      return newItem.save();
    })
    .then(() => res.status(201).json({ message: 'Item added to cart successfully' }))
    .catch(error => res.status(500).json({ error: 'Failed to add item to cart' }));
});

module.exports = router;
