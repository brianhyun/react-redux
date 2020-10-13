const validator = require('validator');
const isEmpty = require('is-empty');

const User = require('../models/User');

function exists(email, username) {
    let errors = {};

    if (existsInUserCollection(email)) {
        errors.email = 'Email address is already in use.';
    }

    if (existsInUserCollection(username)) {
        errors.username = 'Username is already taken.';
    }

    return {
        errors,
        exists: !isEmpty(errors),
    };
}

function existsInUserCollection(data) {
    let exists = false;
    let context = '';

    if (validator.isEmail(data)) {
        context = 'email';
    } else {
        context = 'username';
    }

    User.findOne({ context: data }, (err, user) => {
        if (err) return console.error(err);

        exists = user ? true : false;
    });

    return exists;
}

module.exports = exists;
