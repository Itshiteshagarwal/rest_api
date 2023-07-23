const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../model/user');

// Middleware to parse JSON requests (included in Express, no need for bodyParser)
router.use(express.json());

// Middleware to set up CORS headers and allow requests from any origin
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specific methods (GET, POST, PUT, DELETE)
  next();
});

// Middleware to log the parsed req.body (for debugging)
router.use((req, res, next) => {
  console.log('Parsed req.body:', req.body);
  next();
});

// User Signup Route
router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body;

  // Check if username or email already exists
  User.findOne({ $or: [{ username }, { email }] })
    .exec()
    .then(existingUser => {
      if (existingUser) {
        // Username or email already exists, send an error response
        return res.status(409).json({ error: 'Username or email already exists' });
      }

      // Hash the password using bcrypt
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: 'Password hashing failed' });
        }

        // Create a new User object with the hashed password
        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          username,
          email,
          password: hash,
        });

        // Save the new user to the database
        newUser.save()
          .then(result => {
            console.log(result);
            res.status(201).json({ message: 'User created successfully', user: result });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Failed to save user to the database' });
          });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Server error' });
    });
});

module.exports = router;
