if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const exists = require('../../utils/auth');

const router = express.Router();

router.post('/register', (req, res, next) => {
    // Validate Register Input
    const userInput = req.body;
    const { errors, isValid } = validateRegisterInput(userInput);

    // Check Validation Results
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Check If Email and Username Already Exist in Database
    const email = userInput.email;
    const username = userInput.username;
    const { errors, exists } = exists(email, username);

    if (exists) {
        return res.status(400).json(errors);
    }

    // Create New User
    const newUser = {
        name: req.body.name,
        email: req.body.email,
    };

    // Hash Password
    const saltRounds = 10;
    bcrypt.hash(userInput.password, saltRounds, function (err, hash) {
        if (err) return console.error(err);

        // Override Password with Hash
        newUser.password = hash;

        // Save User to Database
        newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.error(err));
    });
});

router.post('/login', (req, res, next) => {
    // Validate Input
    const userInput = req.body;
    const { errors, isValid } = validateLoginInput(userInput);

    // Check Validation Results
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Check If User Exists
    const email = userInput.email;
    const password = userInput.password;

    User.findOne({ email }, (err, user) => {
        if (err) return console.error(err);

        if (user) {
            bcrypt.compare(password, user.password).then((isMatch) => {
                if (isMatch) {
                    // Create JSON Web Token
                    const payload = {
                        email: email,
                    };

                    jwt.sign(
                        payload,
                        process.env.JWT_PRIVATE_KET,
                        { expiresIn: '1h' },
                        (err, token) => {
                            if (err) return console.error(err);

                            console.log('JWT: ', token);
                        }
                    );
                } else {
                    return res.setStatus(400).json({
                        errorMessage: 'Password entered is incorrect.',
                    });
                }
            });
        } else {
            return res.setStatus(400).json({
                errorMessage:
                    'The account with that email address cannot be found.',
            });
        }
    });
});

module.exports = router;
