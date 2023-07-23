const express = require('express');
const router = express.Router();
const Product = require('../model/products');

// Middleware to handle CORS
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

router.get('/api/products', async (req, res) => {
  try {
    const { categoryId } = req.query;

    // Assuming your Product model has a field called "categoryId" to filter products by category
    const products = await Product.find({ categoryId: categoryId }).sort({ price: 1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
