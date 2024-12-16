const validator = require('validator');

exports.validateEmail = (email) => {
  return validator.isEmail(email);
};

exports.validatePassword = (password) => {
  return password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password);
};

exports.validatePhone = (phone) => {
  return validator.isMobilePhone(phone);
};

exports.validateProfile = (profile) => {
  const errors = [];

  if (profile.displayName && !validator.isLength(profile.displayName, { min: 2, max: 50 })) {
    errors.push('Display name must be between 2 and 50 characters');
  }

  if (profile.bio && !validator.isLength(profile.bio, { max: 500 })) {
    errors.push('Bio must not exceed 500 characters');
  }

  return errors;
};