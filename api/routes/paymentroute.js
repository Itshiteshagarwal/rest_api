
const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const router = express.Router();


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Razorpay with your API key and secret key
const razorpay = new Razorpay({
  key_id: 'rzp_test_mvxSNO6vLXSI0J', 
  key_secret: 'g1yn4ZhwU63zfhqV84tYQ0hU', 
});

// Endpoint to create a Razorpay order
router.post('/api/create-order', async (req, res) => {
  try {
    const { username, amount } = req.body;

    if (!username || !amount || isNaN(amount)) {
      return res.status(400).json({ message: 'Invalid input. Please provide valid username and amount.' });
    }

  
    const amountInPaise = Math.round(parseFloat(amount) * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `order_${Date.now()}`, 
      payment_capture: 1, 
    });


    res.status(200).json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order. Please try again later.' });
  }
});

module.exports = router;