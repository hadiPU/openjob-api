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
            u.fullname AS applicant_name, u.email AS applicant_email,
            j.title AS job_title, j.company_id,
            c.name AS company_name,
            cat.name AS category_name,
            j.location AS job_location,
            j.type AS job_type,
            j.experience_level
     FROM applications a
     JOIN users u ON a.user_id = u.id
     JOIN jobs j ON a.job_id = j.id
     LEFT JOIN companies c ON j.company_id = c.id
     LEFT JOIN categories cat ON j.category_id = cat.id
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