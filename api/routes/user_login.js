const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res, next) => {
  console.log(req.body);
  User.findOne({ username: req.body.username })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).json({
          msg: 'User not found'
        });
      }

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (!result) {
          return res.status(401).json({
            msg: 'Password not matched'
          });
        }

        if (result) {
          const token = jwt.sign(
            {
              username: user.username,
              email: user.email
            },
            'this is dummy text',
            {
              expiresIn: '24h'
            }
          );

          res.status(200).json({
            username: user.username,
            email: user.email,
            token: token,
            redirectURL: 'http://127.0.0.1:5500/home.html' // Modify this URL according to your home page URL
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
