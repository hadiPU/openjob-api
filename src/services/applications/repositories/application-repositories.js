const pool = require('../../../../database');
const { v4: uuidv4 } = require('uuid');
const NotFoundError = require('../../../exceptions/NotFoundError');

const createApplication = async ({ user_id, job_id, cover_letter }) => {
  const id = uuidv4();
  await pool.query(
    'INSERT INTO applications (id, user_id, job_id, cover_letter) VALUES ($1,$2,$3,$4)',
    [id, user_id, job_id, cover_letter]
  );
  return id;
};

const getAllApplications = async () => {
  const { rows } = await pool.query(
    'SELECT * FROM applications ORDER BY created_at DESC'
  );
  return rows;
};

const getApplicationsByUser = async (userId) => {
  const { rows } = await pool.query(
    'SELECT * FROM applications WHERE user_id=$1 ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

const getApplicationsByJob = async (jobId) => {
  const { rows } = await pool.query(
    'SELECT * FROM applications WHERE job_id=$1 ORDER BY created_at DESC',
    [jobId]
  );
  return rows;
};

const getApplicationById = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, user_id, job_id, status, cover_letter, created_at FROM applications WHERE id=$1',
    [id]
  );
  if (!rows.length) throw new NotFoundError('Application not found');
  return rows[0];
};

const updateApplicationStatus = async ({ id, status }) => {
  const { rowCount } = await pool.query(
    'UPDATE applications SET status=$1 WHERE id=$2',
    [status, id]
  );
  if (!rowCount) throw new NotFoundError('Application not found');
};

const deleteApplication = async ({ id, user_id }) => {
  const { rowCount } = await pool.query(
    'DELETE FROM applications WHERE id=$1 AND user_id=$2',
    [id, user_id]
  );
  if (!rowCount) throw new NotFoundError('Application not found or unauthorized');
};

module.exports = {
  createApplication, getAllApplications, getApplicationsByUser,
  getApplicationsByJob, getApplicationById, updateApplicationStatus,
  deleteApplication
};