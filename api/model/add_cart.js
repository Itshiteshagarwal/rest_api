// models/cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Use ObjectId to link it to a User model if you have one.
    required: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products' // Use the correct model name ('Product') to reference the Product model.
      },
      productName: {
        type: String,
        required: true
      },
      productPrice: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
});

module.exports = mongoose.model('Cart', cartSchema);
