// app.js (or your main server file)
const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const router = express.Router();


const app = express();

// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialize Razorpay with your API key and secret key
const razorpay = new Razorpay({
  key_id: 'rzp_test_mvxSNO6vLXSI0J',
  key_secret: 'g1yn4ZhwU63zfhqV84tYQ0hU',
});



// Endpoint to create a Razorpay order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Create an order with the given amount and currency
    const order = await razorpay.orders.create({
      amount: amount, // Amount in paise (e.g., 1000 paise = Rs 10.00)
      currency: currency || 'INR',
      receipt: 'order_receipt', // Replace with your order receipt ID or generate dynamically
      payment_capture: 1, // Auto-capture the payment when the order is created
    });

    // Send the order ID and other details to the client
    res.status(200).json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order. Please try again later.' });
  }
});

// Endpoint to verify the payment after successful payment
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    // Verify the payment signature to ensure its authenticity
    const attributes = {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
    };
    const generatedSignature = razorpay.webhook.calculateSignature(JSON.stringify(attributes), 'YOUR_WEBHOOK_SECRET_KEY');
    if (generatedSignature === signature) {
      // Payment signature is valid
      // You can update your database or handle other operations here
      res.status(200).json({ message: 'Payment verified and successful!' });
    } else {
      // Payment signature is invalid
      res.status(403).json({ message: 'Invalid payment verification.' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Failed to verify payment. Please try again later.' });
  }
});

module.exports = router;