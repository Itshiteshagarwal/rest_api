const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type:String,
    required: true,
    ref: 'User' // Use the correct model name ('User') to reference the User model.
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product' // Use the correct model name ('Product') to reference the Product model.
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
