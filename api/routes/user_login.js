const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const jwt = require('jsonwebtoken');

router.use(express.json());

router.post('/login', (req, res, next) => {
    User.findOne({ username: req.body.username })
        .exec()
        .then(user => {
            if (!user) {
                // User not found or invalid username
                return res.status(401).json({ msg: 'Invalid credentials' });
            }

            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (!result) {
                    // Password doesn't match
                    return res.status(401).json({ msg: 'Invalid credentials' });
                }

                if (result) {
                    // Password matches, generate and send the JWT token
                    const token = jwt.sign(
                        {
                            username: user.username,
                            email: user.email,
                        },
                        'this is dummy text',
                        { expiresIn: '24h' }
                    );

                    res.status(200).json({
                        username: user.username,
                        email: user.email,
                        token: token
                    });
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'An error occurred' });
        });
});

module.exports = router;
