const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../model/user');


router.use(express.json());

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specific methods (GET, POST, PUT, DELETE)
  next();
});


router.use((req, res, next) => {
  console.log('Parsed req.body:', req.body);
  next();
});


router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body;


  User.findOne({ $or: [{ username }, { email }] })
    .exec()
    .then(existingUser => {
      if (existingUser) {

        return res.status(409).json({ error: 'Username or email already exists' });
      }

      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: 'Password hashing failed' });
        }

        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          username,
          email,
          password: hash,
        });

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
