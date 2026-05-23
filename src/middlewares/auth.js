require('dotenv').config();
const jwt = require('jsonwebtoken');
const AuthenticationError = require('../exceptions/AuthenticationError');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('Missing or invalid authorization token'));
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.user = decoded;
    next();
  } catch {
    next(new AuthenticationError('Token invalid or expired'));
  }
};

module.exports = auth;