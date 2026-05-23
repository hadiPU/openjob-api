const pool = require('../../../../database');
const { v4: uuidv4 } = require('uuid');
const NotFoundError = require('../../../exceptions/NotFoundError');

const getAllBookmarks = async (userId) => {
  const { rows } = await pool.query(
    `SELECT b.id, b.user_id, b.job_id, b.created_at, j.title AS job_title
     FROM bookmarks b
     JOIN jobs j ON b.job_id = j.id
     WHERE b.user_id=$1 ORDER BY b.created_at DESC`,
    [userId]
  );
  return rows;
};

const getBookmarkById = async ({ id, jobId }) => {
  const { rows } = await pool.query(
    'SELECT id, user_id, job_id, created_at FROM bookmarks WHERE id=$1 AND job_id=$2',
    [id, jobId]
  );
  if (!rows.length) throw new NotFoundError('Bookmark not found');
  return rows[0];
};

const createBookmark = async ({ user_id, job_id }) => {
  const id = uuidv4();
  await pool.query(
    'INSERT INTO bookmarks (id, user_id, job_id) VALUES ($1,$2,$3)',
    [id, user_id, job_id]
  );
  return id;
};

const deleteBookmark = async ({ user_id, job_id }) => {
  const { rowCount } = await pool.query(
    'DELETE FROM bookmarks WHERE user_id=$1 AND job_id=$2',
    [user_id, job_id]
  );
  if (!rowCount) throw new NotFoundError('Bookmark not found');
};

module.exports = { getAllBookmarks, getBookmarkById, createBookmark, deleteBookmark };