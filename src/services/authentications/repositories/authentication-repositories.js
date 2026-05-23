const pool = require('../../../../database');
const bcrypt = require('bcrypt');
const AuthenticationError = require('../../../exceptions/AuthenticationError');
const InvariantError = require('../../../exceptions/InvariantError');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../../../security/token-manager');

const login = async ({ email, password }) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  if (!rows.length) throw new AuthenticationError('Invalid email or password');
  const valid = await bcrypt.compare(password, rows[0].password);
  if (!valid) throw new AuthenticationError('Invalid email or password');
  const accessToken = generateAccessToken({ id: rows[0].id });
  const refreshToken = generateRefreshToken({ id: rows[0].id });
  await pool.query('INSERT INTO authentications (token) VALUES ($1)', [refreshToken]);
  return { accessToken, refreshToken };
};

const refresh = async ({ refreshToken }) => {
  const { rows } = await pool.query('SELECT * FROM authentications WHERE token=$1', [refreshToken]);
  if (!rows.length) throw new InvariantError('Refresh token not found');
  const decoded = verifyRefreshToken(refreshToken);
  return { accessToken: generateAccessToken({ id: decoded.id }) };
};

const logout = async ({ refreshToken }) => {
  if (!refreshToken) throw new InvariantError('refreshToken is required');
  const { rows } = await pool.query('SELECT * FROM authentications WHERE token=$1', [refreshToken]);
  if (!rows.length) throw new InvariantError('Refresh token not found');
  await pool.query('DELETE FROM authentications WHERE token=$1', [refreshToken]);
};

module.exports = { login, refresh, logout };