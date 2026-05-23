const pool = require('../../../../database');
const NotFoundError = require('../../../exceptions/NotFoundError');

const getProfile = async (userId) => {
  const { rows } = await pool.query(
    'SELECT id, fullname AS name, email, role, created_at FROM users WHERE id=$1',
    [userId]
  );
  if (!rows.length) throw new NotFoundError('User not found');
  return rows[0];
};

const getProfileApplications = async (userId) => {
  const { rows } = await pool.query(
    `SELECT a.id, a.user_id, a.job_id, a.status, a.cover_letter, a.created_at,
            j.title AS job_title
     FROM applications a
     JOIN jobs j ON a.job_id = j.id
     WHERE a.user_id=$1 ORDER BY a.created_at DESC`,
    [userId]
  );
  return rows;
};

const getProfileBookmarks = async (userId) => {
  const { rows } = await pool.query(
    `SELECT b.id, b.user_id, b.job_id, b.created_at,
            j.title AS job_title
     FROM bookmarks b
     JOIN jobs j ON b.job_id = j.id
     WHERE b.user_id=$1 ORDER BY b.created_at DESC`,
    [userId]
  );
  return rows;
};

module.exports = { getProfile, getProfileApplications, getProfileBookmarks };