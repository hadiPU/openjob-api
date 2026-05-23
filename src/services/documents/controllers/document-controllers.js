const {
  getAllDocuments, getDocumentById, createDocument, deleteDocument
} = require('../repositories/document-repositories');
const InvariantError = require('../../../exceptions/InvariantError');

const getDocuments = async (req, res, next) => {
  try {
    const documents = await getAllDocuments();
    res.json({ status: 'success', data: { documents } });
  } catch (err) { next(err); }
};

const getDocument = async (req, res, next) => {
  try {
    const document = await getDocumentById(req.params.id);
    res.json({ status: 'success', data: { document } });
  } catch (err) { next(err); }
};

const addDocument = async (req, res, next) => {
  try {
    if (!req.file) throw new InvariantError('No file uploaded');
    const { id, url } = await createDocument({
      user_id: req.user.id,
      filename: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
    });
    res.status(201).json({ status: 'success', data: { id, url } });
  } catch (err) { next(err); }
};

const removeDocument = async (req, res, next) => {
  try {
    await deleteDocument({ id: req.params.id, user_id: req.user.id });
    res.json({ status: 'success', message: 'Document deleted' });
  } catch (err) { next(err); }
};

module.exports = { getDocuments, getDocument, addDocument, removeDocument };