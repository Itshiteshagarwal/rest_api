const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const jwt = require('jsonwebtoken');

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
            userId: user._id,
            username: user.username,
            email: user.email,
          },
          'your_secret_key_here',
          {
            expiresIn: '24h',
          }
        );

        // Send success message and token back to the login page
        res.status(200).json({ msg: 'User login successful', token });

        // Redirect the user to the home page (assuming the home page URL is '/home')
        // Alternatively, you can use JavaScript to redirect on the client side after receiving the success response.
        // res.redirect('/home');
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Server error' });
    });
});

module.exports = router;
