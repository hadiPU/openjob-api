const pool = require('../../../../database');
const { v4: uuidv4 } = require('uuid');
const NotFoundError = require('../../../exceptions/NotFoundError');

const getAllJobs = async ({ title, companyName } = {}) => {
  let query = `
    SELECT j.id, j.title, j.description, j.salary, j.location,
           j.type, j.company_id, j.category_id, j.created_at,
           j.job_type, j.experience_level, j.status,
           c.name AS company_name
    FROM jobs j
    LEFT JOIN companies c ON j.company_id = c.id
    LEFT JOIN categories cat ON j.category_id = cat.id
    WHERE 1=1
  `;
  const params = [];
  if (title) {
    params.push(`%${title.toLowerCase()}%`);
    query += ` AND LOWER(j.title) LIKE $${params.length}`;
  }
  if (companyName) {
    params.push(`%${companyName.toLowerCase()}%`);
    query += ` AND LOWER(c.name) LIKE $${params.length}`;
  }
  query += ' ORDER BY j.created_at DESC';
  const { rows } = await pool.query(query, params);
  return rows;
};

const getJobsByCompany = async (companyId) => {
  const { rows } = await pool.query(
    'SELECT * FROM jobs WHERE company_id=$1 ORDER BY created_at DESC',
    [companyId]
  );
  return rows;
};

const getJobsByCategory = async (categoryId) => {
  const { rows } = await pool.query(
    'SELECT * FROM jobs WHERE category_id=$1 ORDER BY created_at DESC',
    [categoryId]
  );
  return rows;
};

const getJobById = async (id) => {
  const { rows } = await pool.query(
    `SELECT j.id, j.title, j.description, j.salary, j.location, j.type,
            j.job_type, j.experience_level, j.location_type, j.location_city,
            j.salary_min, j.salary_max, j.is_salary_visible, j.status,
            j.company_id, j.category_id, j.created_at,
            c.name AS company_name, cat.name AS category_name
     FROM jobs j
     LEFT JOIN companies c ON j.company_id = c.id
     LEFT JOIN categories cat ON j.category_id = cat.id
     WHERE j.id=$1`,
    [id]
  );
  if (!rows.length) throw new NotFoundError('Job not found');
  return rows[0];
};

const createJob = async (payload) => {
  const {
    title, description, salary, location, type,
    company_id, category_id, job_type, experience_level,
    location_type, location_city, salary_min, salary_max,
    is_salary_visible, status
  } = payload;

  const id = uuidv4();
  await pool.query(
    `INSERT INTO jobs
      (id, title, description, salary, location, type, company_id, category_id,
       job_type, experience_level, location_type, location_city,
       salary_min, salary_max, is_salary_visible, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
    [
      id, title, description, salary, location, type || job_type,
      company_id, category_id, job_type, experience_level,
      location_type, location_city, salary_min, salary_max,
      is_salary_visible ?? true, status || 'open'
    ]
  );
  return id;
};

const updateJob = async (id, payload) => {
  const {
    title, description, salary, location, type,
    company_id, category_id, job_type, experience_level,
    location_type, location_city, salary_min, salary_max,
    is_salary_visible, status
  } = payload;

  const { rowCount } = await pool.query(
    `UPDATE jobs SET
      title=$1, description=$2, salary=$3, location=$4, type=$5,
      company_id=$6, category_id=$7, job_type=$8, experience_level=$9,
      location_type=$10, location_city=$11, salary_min=$12, salary_max=$13,
      is_salary_visible=$14, status=$15
     WHERE id=$16`,
    [
      title, description, salary, location, type || job_type,
      company_id, category_id, job_type, experience_level,
      location_type, location_city, salary_min, salary_max,
      is_salary_visible ?? true, status || 'open', id
    ]
  );
  if (!rowCount) throw new NotFoundError('Job not found');
};

const deleteJob = async (id) => {
  await pool.query('DELETE FROM applications WHERE job_id=$1', [id]);
  await pool.query('DELETE FROM bookmarks WHERE job_id=$1', [id]);
  const { rowCount } = await pool.query('DELETE FROM jobs WHERE id=$1', [id]);
  if (!rowCount) throw new NotFoundError('Job not found');
};

module.exports = {
  getAllJobs, getJobsByCompany, getJobsByCategory,
  getJobById, createJob, updateJob, deleteJob
};