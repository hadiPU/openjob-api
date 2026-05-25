const path = require('path');
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
    const filePath = path.join(process.cwd(), 'uploads', path.basename(document.filename));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${document.originalname}"`);
    res.sendFile(filePath);
  } catch (err) { next(err); }
};

const addDocument = async (req, res, next) => {
  try {
    if (!req.file) throw new InvariantError('File is required');
    const { id, url } = await createDocument({
      user_id: req.user.id,
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
    });
    res.status(201).json({
      status: 'success',
      data: {
        documentId: id,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url,
      }
    });
  } catch (err) { next(err); }
};

const removeDocument = async (req, res, next) => {
  try {
    await deleteDocument({ id: req.params.id, user_id: req.user.id });
    res.json({ status: 'success', message: 'Document deleted' });
  } catch (err) { next(err); }
};

module.exports = { getDocuments, getDocument, addDocument, removeDocument };