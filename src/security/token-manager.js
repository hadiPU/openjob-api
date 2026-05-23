const jwt = require('jsonwebtoken');
const AuthenticationError = require('../exceptions/AuthenticationError');

const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: '3h' });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_KEY);

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
  } catch {
    throw new AuthenticationError('Refresh token invalid or expired');
  }
};

module.exports = { generateAccessToken, generateRefreshToken, verifyRefreshToken };