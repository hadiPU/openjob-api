const pool = require('../../../../database');
const { v4: uuidv4 } = require('uuid');
const NotFoundError = require('../../../exceptions/NotFoundError');
const cache = require('../../../utils/cache');

const getAllCompanies = async () => {
  const { rows } = await pool.query(
    `SELECT id, name, description, location, website, created_at 
     FROM companies ORDER BY created_at DESC`
  );
  return rows;
};

const getCompanyById = async (id) => {
  const cacheKey = `company:${id}`;
  const cached = await cache.get(cacheKey);
  if (cached) return { ...cached, fromCache: true };

  const { rows } = await pool.query(
    'SELECT id, name, description, location, website, owner_id, created_at FROM companies WHERE id=$1',
    [id]
  );
  if (!rows.length) throw new NotFoundError('Company not found');
  await cache.set(cacheKey, rows[0]);
  return { ...rows[0], fromCache: false };
};

const createCompany = async ({ name, description, location, website, owner_id }) => {
  const id = uuidv4();
  await pool.query(
    'INSERT INTO companies (id, name, description, location, website, owner_id) VALUES ($1,$2,$3,$4,$5,$6)',
    [id, name, description, location, website, owner_id]
  );
  return id;
};

const updateCompany = async ({ id, name, description, location, website, owner_id }) => {
  const { rowCount } = await pool.query(
    'UPDATE companies SET name=$1, description=$2, location=$3, website=$4 WHERE id=$5 AND owner_id=$6',
    [name, description, location, website, id, owner_id]
  );
  if (!rowCount) throw new NotFoundError('Company not found or unauthorized');
  await cache.del(`company:${id}`);
};

const deleteCompany = async ({ id, owner_id }) => {
  const { rows: jobs } = await pool.query(
    'SELECT id FROM jobs WHERE company_id=$1', [id]
  );
  for (const job of jobs) {
    await pool.query('DELETE FROM applications WHERE job_id=$1', [job.id]);
    await pool.query('DELETE FROM bookmarks WHERE job_id=$1', [job.id]);
  }
  await pool.query('DELETE FROM jobs WHERE company_id=$1', [id]);
  const { rowCount } = await pool.query(
    'DELETE FROM companies WHERE id=$1 AND owner_id=$2',
    [id, owner_id]
  );
  if (!rowCount) throw new NotFoundError('Company not found or unauthorized');
  await cache.del(`company:${id}`);
};

module.exports = {
  getAllCompanies, getCompanyById, createCompany, updateCompany, deleteCompany
};