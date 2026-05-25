const pool = require('../../../../database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const NotFoundError = require('../../../exceptions/NotFoundError');
const InvariantError = require('../../../exceptions/InvariantError');
const cache = require('../../../utils/cache');

const createUser = async ({ name, email, password, role = 'user' }) => {
  const hashed = await bcrypt.hash(password, 10);
  const id = uuidv4();
  try {
    await pool.query(
      'INSERT INTO users (id, fullname, email, password, role) VALUES ($1,$2,$3,$4,$5)',
      [id, name, email, hashed, role]
    );
  } catch (err) {
    if (err.code === '23505') throw new InvariantError('Email already in use');
    throw err;
  }
  return id;
};

const getUserById = async (id) => {
  const cacheKey = `user:${id}`;
  const cached = await cache.get(cacheKey);
  if (cached) return { ...cached, fromCache: true };

  const { rows } = await pool.query(
    'SELECT id, fullname AS name, email, role, created_at FROM users WHERE id=$1',
    [id]
  );
  if (!rows.length) throw new NotFoundError('User not found');
  await cache.set(cacheKey, rows[0]);
  return { ...rows[0], fromCache: false };
};

module.exports = { createUser, getUserById };