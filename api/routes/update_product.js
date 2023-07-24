const express = require('express');
const router = express.Router();
const Product = require('../model/products');

router.put('/api/products/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    // Check if the product with the given productId exists in the database
    const existingProduct = await Product.findOne({ productId });
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get the updated fields from the request body
    const { name, price, description, categoryId, image } = req.body;

    // Update the product fields with the new values
    existingProduct.name = name;
    existingProduct.price = price;
    existingProduct.description = description;
    existingProduct.categoryId = categoryId;
    existingProduct.image = image;

    // Save the updated product to the database
    const updatedProduct = await existingProduct.save();
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: 'Error updating product', err });
  }
});

module.exports = router;
