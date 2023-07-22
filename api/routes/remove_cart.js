const express = require('express');
const router = express.Router();
const CartItem = require('../model/add_cart');

router.delete('/:productId', (req, res) => {
  const productId = req.params.productId;

  // Find the cart item by productId and remove it
  CartItem.findOneAndDelete({ productId })
    .then(removedItem => {
      if (!removedItem) {
        return res.status(404).json({ error: 'Item not found in cart' });
      }

      res.json({ message: 'Item deleted from cart successfully' });
    })
    .catch(error => res.status(500).json({ error: 'Failed to delete item from cart' }));
});

module.exports = router;
