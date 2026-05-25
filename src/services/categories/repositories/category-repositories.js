const pool = require('../../../../database');
const { v4: uuidv4 } = require('uuid');
const NotFoundError = require('../../../exceptions/NotFoundError');

const getAllCategories = async () => {
  const { rows } = await pool.query(
    'SELECT id, name, description, created_at FROM categories ORDER BY name'
  );
  return rows;
};

const getCategoryById = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, name FROM categories WHERE id=$1',
    [id]
  );
  if (!rows.length) throw new NotFoundError('Category not found');
  return rows[0];
};

const createCategory = async ({ name }) => {
  const id = uuidv4();
  await pool.query('INSERT INTO categories (id, name) VALUES ($1,$2)', [id, name]);
  return id;
};

const updateCategory = async ({ id, name }) => {
  const { rowCount } = await pool.query(
    'UPDATE categories SET name=$1 WHERE id=$2',
    [name, id]
  );
  if (!rowCount) throw new NotFoundError('Category not found');
};

const deleteCategory = async (id) => {
  const { rows: jobs } = await pool.query(
    'SELECT id FROM jobs WHERE category_id=$1', [id]
  );
  for (const job of jobs) {
    await pool.query('DELETE FROM applications WHERE job_id=$1', [job.id]);
    await pool.query('DELETE FROM bookmarks WHERE job_id=$1', [job.id]);
  }
  await pool.query('DELETE FROM jobs WHERE category_id=$1', [id]);
  const { rowCount } = await pool.query(
    'DELETE FROM categories WHERE id=$1', [id]
  );
  if (!rowCount) throw new NotFoundError('Category not found');
};

module.exports = {
  getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory
};