const validator = require('validator');
const isEmpty = require('is-empty');

function validateLoginInput(data) {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.username = !isEmpty(data.username) ? data.username : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    // Email Checks
    if (validator.isEmpty(data.username)) {
        errors.username = 'Username field is required';
    } else if (!validator.isEmail(data.username)) {
        errors.username = 'Username is invalid';
    }

    // Password Checks
    if (validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
}

module.exports = validateLoginInput;
