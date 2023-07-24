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
        ref: 'Product', // Use the correct model name ('Product') to reference the Product model.
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
        min: 1, // Ensure the quantity is always at least 1.
      },
      productImage: {
        type: String, // Assuming the product image will be stored as a URL or file path.
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);
