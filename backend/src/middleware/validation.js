const { validateProfile, validateEmail, validatePassword } = require('../utils/validation');

exports.validateUserInput = (req, res, next) => {
  const { email, password, profile } = req.body;
  const errors = [];

  if (email && !validateEmail(email)) {
    errors.push('Invalid email format');
  }

  if (password && !validatePassword(password)) {
    errors.push('Password does not meet security requirements');
  }

  if (profile) {
    const profileErrors = validateProfile(profile);
    errors.push(...profileErrors);
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};