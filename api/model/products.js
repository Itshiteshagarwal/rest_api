const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    categoryId: {
      type: String,
      required: true
    },
    image: {
      type: String 
    },
  });

  module.exports = mongoose.model('product', productSchema);
