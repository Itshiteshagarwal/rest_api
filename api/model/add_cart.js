// models/cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: String, // You can use ObjectId if you have a separate User model and want to link it.
    required: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
});

module.exports = mongoose.model('Cart', cartSchema);
