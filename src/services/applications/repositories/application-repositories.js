const pool = require('../../../../database');
const { v4: uuidv4 } = require('uuid');
const NotFoundError = require('../../../exceptions/NotFoundError');
const cache = require('../../../utils/cache');
const rabbitmq = require('../../../utils/rabbitmq');
const InvariantError = require('../../../exceptions/InvariantError');

const createApplication = async ({ user_id, job_id, cover_letter }) => {
  // Cek duplicate
  const { rows: existing } = await pool.query(
    'SELECT id FROM applications WHERE user_id=$1 AND job_id=$2',
    [user_id, job_id]
  );
  if (existing.length) {
    throw new InvariantError('Already applied for this job'); // ← pakai InvariantError
  }

  const id = uuidv4();
  try {
    await pool.query(
      'INSERT INTO applications (id, user_id, job_id, cover_letter) VALUES ($1,$2,$3,$4)',
      [id, user_id, job_id, cover_letter]
    );
  } catch (err) {
    if (err.code === '23503') throw new NotFoundError('Job not found');
    throw err;
  }
  await cache.del(`applications:user:${user_id}`);
  await cache.del(`applications:job:${job_id}`);
  await rabbitmq.publish('applications', { application_id: id });

  // Return data lengkap
  return { id, user_id, job_id, status: 'pending', cover_letter };
};

const getAllApplications = async () => {
  const { rows } = await pool.query(
    `SELECT a.id, a.user_id, a.job_id, a.status, a.cover_letter, a.created_at,
            u.fullname AS applicant_name, u.email AS applicant_email,
            j.title AS job_title, j.company_id,
            c.name AS company_name,
            cat.name AS category_name,
            j.location AS job_location
     FROM applications a
     JOIN users u ON a.user_id = u.id
     JOIN jobs j ON a.job_id = j.id
     LEFT JOIN companies c ON j.company_id = c.id
     LEFT JOIN categories cat ON j.category_id = cat.id
     ORDER BY a.created_at DESC`
  );
  return rows;
};

const getApplicationsByUser = async (userId) => {
  const cacheKey = `applications:user:${userId}`;
  const cached = await cache.get(cacheKey);
  if (cached) return { data: cached, fromCache: true };

  const { rows } = await pool.query(
    'SELECT * FROM applications WHERE user_id=$1 ORDER BY created_at DESC',
    [userId]
  );
  await cache.set(cacheKey, rows);
  return { data: rows, fromCache: false };
};

const getApplicationsByJob = async (jobId) => {
  const cacheKey = `applications:job:${jobId}`;
  const cached = await cache.get(cacheKey);
  if (cached) return { data: cached, fromCache: true };

  const { rows } = await pool.query(
    'SELECT * FROM applications WHERE job_id=$1 ORDER BY created_at DESC',
    [jobId]
  );
  await cache.set(cacheKey, rows);
  return { data: rows, fromCache: false };
};

const getApplicationById = async (id) => {
  const cacheKey = `application:${id}`;
  const cached = await cache.get(cacheKey);
  if (cached) return { ...cached, fromCache: true };

  const { rows } = await pool.query(
    'SELECT id, user_id, job_id, status, cover_letter, created_at FROM applications WHERE id=$1',
    [id]
  );
  if (!rows.length) throw new NotFoundError('Application not found');
  await cache.set(cacheKey, rows[0]);
  return { ...rows[0], fromCache: false };
};

const updateApplicationStatus = async ({ id, status }) => {
  const { rows } = await pool.query(
    'SELECT user_id, job_id FROM applications WHERE id=$1', [id]
  );
  if (!rows.length) throw new NotFoundError('Application not found');

  await pool.query('UPDATE applications SET status=$1 WHERE id=$2', [status, id]);

  await cache.del(`application:${id}`);
  await cache.del(`applications:user:${rows[0].user_id}`);
  await cache.del(`applications:job:${rows[0].job_id}`);
};

const deleteApplication = async ({ id, user_id }) => {
  // Ambil data dulu untuk invalidate cache
  const { rows } = await pool.query(
    'SELECT user_id, job_id FROM applications WHERE id=$1 AND user_id=$2',
    [id, user_id]
  );
  if (!rows.length) throw new NotFoundError('Application not found or unauthorized');

  await pool.query(
    'DELETE FROM applications WHERE id=$1 AND user_id=$2',
    [id, user_id]
  );

  // Invalidate semua cache terkait
  await cache.del(`application:${id}`);
  await cache.del(`applications:user:${rows[0].user_id}`);
  await cache.del(`applications:job:${rows[0].job_id}`);
};

module.exports = {
  createApplication, getAllApplications, getApplicationsByUser,
  getApplicationsByJob, getApplicationById, updateApplicationStatus,
  deleteApplication
};