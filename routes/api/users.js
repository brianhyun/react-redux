if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const emailOrUsernameExists = require('../../utils/auth');

const router = express.Router();

router.post('/register', (req, res, next) => {
    // Validate Register Input
    const { errors: validationErrors, isValid } = validateRegisterInput(
        req.body
    );

    // Check Validation Results
    if (!isValid) {
        return res.status(400).json(validationErrors);
    }

    // Check If Email and Username Already Exist in Database
    emailOrUsernameExists(req.body)
        .then((data) => {
            if (data.itExists) {
                return res.status(400).json(data.errors);
            } else {
                // Create New User
                const newUser = new User({
                    name: req.body.name,
                    username: req.body.username,
                    email: req.body.email,
                });

                // Hash Password
                const saltRounds = 10;
                bcrypt.hash(req.body.password, saltRounds, function (
                    err,
                    hash
                ) {
                    if (err) return console.error(err);

                    // Override Password with Hash
                    newUser.password = hash;

                    // Save User to Database
                    newUser
                        .save()
                        .then((user) => res.json(user))
                        .catch((err) => console.error(err));
                });
            }
        })
        .catch((err) => {
            console.error(err);
        });
});

router.post('/login', (req, res, next) => {
    // Validate Input
    const { errors, isValid } = validateLoginInput(req.body);

    // Check Validation Results
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Check If User Exists
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username }, (err, user) => {
        if (err) return console.error(err);

        if (user) {
            bcrypt.compare(password, user.password).then((isMatch) => {
                if (isMatch) {
                    // Create JSON Web Token
                    const payload = {
                        id: user.id,
                        username: username,
                    };

                    jwt.sign(
                        payload,
                        process.env.JWT_PRIVATE_KEY,
                        { expiresIn: '1h' },
                        (err, token) => {
                            if (err) return console.error(err);

                            res.send(token);
                        }
                    );
                } else {
                    return res.status(400).json({
                        password: 'Password entered is incorrect.',
                    });
                }
            });
        } else {
            return res.status(400).json({
                username: 'An account with that username cannot be found.',
            });
        }
    });
});

module.exports = router;
