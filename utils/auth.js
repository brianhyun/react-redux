const isEmpty = require('is-empty');

const User = require('../models/User');

async function emailOrUsernameExists(data) {
    const email = data.email;
    const username = data.username;
    let errors = {};

    await User.findOne({ email })
        .then((user) => {
            if (user) {
                errors.email = 'Email address is already in use.';
            }
        })
        .then(() => {
            return User.findOne({ username });
        })
        .then((user) => {
            if (user) {
                errors.username =
                    'An account with that username already exists.';
            }
        })
        .catch((err) => {
            if (err) console.error(err);
        });

    return {
        errors,
        itExists: !isEmpty(errors),
    };
}

module.exports = emailOrUsernameExists;
