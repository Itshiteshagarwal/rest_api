const express = require('express');
const router = express.Router();
const Product = require('../model/products');

router.get('/api/products', async (req, res) => {
  try {
    const { sortBy } = req.query;
    let sortOption = {};

    if (sortBy === 'lowToHigh') {
      sortOption = { price: 1 }; // Sort by price in ascending order
    } else if (sortBy === 'highToLow') {
      sortOption = { price: -1 }; // Sort by price in descending order
    }

    const products = await Product.find().sort(sortOption);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
