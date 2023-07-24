const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const jwt = require('jsonwebtoken');

// Enable CORS to allow requests from any frontend domain
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', '*'); // Allow all methods (GET, POST, PUT, DELETE, etc.)
    next();
  });
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).json({ msg: 'User not found' });
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Something went wrong' });
        }

        if (!result) {
          return res.status(401).json({ msg: 'Password does not match' });
        }

        // Password matches, create a JSON Web Token (JWT)
        const token = jwt.sign(
          {
            userId: user.userId,
            username: user.username,
            email: user.email,
          },
          'your_secret_key_here', // Replace 'your_secret_key_here' with your actual JWT secret key
          {
            expiresIn: '24h',
          }
        );

        res.status(200).json({ msg: 'User login successful', token });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Server error' });
    });
});

module.exports = router;
