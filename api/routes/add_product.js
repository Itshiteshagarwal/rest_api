const express = require('express');
const router = express.Router();
const Product = require('../model/products');

router.post('/api/products', async (req, res) => {
  try {
    const { productId, name, price, description, categoryId, image } = req.body;

    // Check if the product with the given productId already exists in the database
    const existingProduct = await Product.findOne({ productId });
    if (existingProduct) {
      return res.status(400).json({ error: 'Product with the same productId already exists' });
    }

    // Create a new product instance based on the Product model
    const product = new Product({
      productId,
      name,
      price,
      description,
      categoryId,
      image,
    });

    // Save the product to the database
    const savedProduct = await product.save();
    res.status(201).json({ message: 'Product created successfully', product: savedProduct });
  } catch (err) {
    res.status(500).json({ error: 'Error creating product', err });
  }
});

module.exports = router;
