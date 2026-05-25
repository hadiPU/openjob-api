const pool = require('../../../../database');
const { v4: uuidv4 } = require('uuid');
const NotFoundError = require('../../../exceptions/NotFoundError');
const cache = require('../../../utils/cache');

const getAllBookmarks = async (userId) => {
  const cacheKey = `bookmarks:user:${userId}`;
  const cached = await cache.get(cacheKey);
  if (cached) return { data: cached, fromCache: true };

  const { rows } = await pool.query(
    `SELECT b.id, b.user_id, b.job_id, b.created_at,
            j.title AS job_title, j.description AS job_description,
            j.salary, j.location AS job_location, j.type AS job_type,
            j.status AS job_status, j.company_id, j.category_id,
            j.experience_level AS job_experience_level,
            c.name AS company_name, c.location AS company_location,
            c.description AS company_description,
            cat.name AS category_name,
            u.fullname AS owner_name
     FROM bookmarks b
     JOIN jobs j ON b.job_id = j.id
     LEFT JOIN companies c ON j.company_id = c.id
     LEFT JOIN categories cat ON j.category_id = cat.id
     LEFT JOIN users u ON c.owner_id = u.id
     WHERE b.user_id=$1 ORDER BY b.created_at DESC`,
    [userId]
  );
  await cache.set(cacheKey, rows);
  return { data: rows, fromCache: false };
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
  await cache.del(`bookmarks:user:${user_id}`);
  return id;
};

const deleteBookmark = async ({ user_id, job_id }) => {
  const { rowCount } = await pool.query(
    'DELETE FROM bookmarks WHERE user_id=$1 AND job_id=$2',
    [user_id, job_id]
  );
  if (!rowCount) throw new NotFoundError('Bookmark not found');
  await cache.del(`bookmarks:user:${user_id}`);
};

module.exports = { getAllBookmarks, getBookmarkById, createBookmark, deleteBookmark };