const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      productPrice: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1, 
      },
      productImage: {
        type: String, 
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);
