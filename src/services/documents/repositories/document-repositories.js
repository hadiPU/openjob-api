const pool = require('../../../../database');
const { v4: uuidv4 } = require('uuid');
const NotFoundError = require('../../../exceptions/NotFoundError');

const getAllDocuments = async () => {
  const { rows } = await pool.query(
    'SELECT * FROM documents ORDER BY created_at DESC'
  );
  return rows;
};

const getDocumentById = async (id) => {
  const { rows } = await pool.query(
    'SELECT * FROM documents WHERE id=$1',
    [id]
  );
  if (!rows.length) throw new NotFoundError('Document not found');
  return rows[0];
};

const createDocument = async ({ user_id, filename, url }) => {
  const id = uuidv4();
  await pool.query(
    'INSERT INTO documents (id, user_id, filename, url) VALUES ($1,$2,$3,$4)',
    [id, user_id, filename, url]
  );
  return { id, url };
};

const deleteDocument = async ({ id, user_id }) => {
  const { rowCount } = await pool.query(
    'DELETE FROM documents WHERE id=$1 AND user_id=$2',
    [id, user_id]
  );
  if (!rowCount) throw new NotFoundError('Document not found or unauthorized');
};

module.exports = { getAllDocuments, getDocumentById, createDocument, deleteDocument };