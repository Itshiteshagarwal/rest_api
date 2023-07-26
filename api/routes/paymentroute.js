// app.js (or your main server file)
const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const router = express.Router();


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Initialize Razorpay with your API key and secret key
const razorpay = new Razorpay({
  key_id: 'rzp_test_mvxSNO6vLXSI0J', // Replace with your Razorpay key ID
  key_secret: 'g1yn4ZhwU63zfhqV84tYQ0hU', // Replace with your Razorpay secret key
});

// Endpoint to create a Razorpay order
router.post('/api/create-order', async (req, res) => {
  try {
    const { username, amount } = req.body;

    // Validate the inputs (you can add more validation as needed)
    if (!username || !amount || isNaN(amount)) {
      return res.status(400).json({ message: 'Invalid input. Please provide valid username and amount.' });
    }

    // Convert the amount to paise (Razorpay requires the amount in paise)
    const amountInPaise = Math.round(parseFloat(amount) * 100);

    // Create an order with the given amount and currency (INR by default)
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `order_${Date.now()}`, // Replace with your custom receipt ID or generate dynamically
      payment_capture: 1, // Auto-capture the payment when the order is created
    });

    // Send the order ID and other details to the client
    res.status(200).json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order. Please try again later.' });
  }
});

module.exports = router;