const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../model/user');

// No need to require bodyParser separately since it's included in Express
// const bodyParser = require('body-parser');

// Middleware to parse JSON requests
router.use(express.json());

// Middleware to check body-parser
router.use((req, res, next) => {
  console.log('Parsed req.body:', req.body);
  next();
});

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err
      });
    } else {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        email: req.body.email,
        password: hash,
      });

      user.save()
        .then(result => {
          console.log(result);
          res.status(200).json({
            new_user: result
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
    }
  });
});

module.exports = router;
