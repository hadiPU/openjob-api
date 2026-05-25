const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../../../middlewares/auth');
const InvariantError = require('../../../exceptions/InvariantError');
const {
  getDocuments, getDocument, addDocument, removeDocument
} = require('../controllers/document-controllers');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new InvariantError('File is required. Only PDF files are allowed'), false);
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const uploadMiddleware = (req, res, next) => {
  upload.single('document')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new InvariantError('File size exceeds 5MB limit'));
      }
      return next(new InvariantError(err.message));
    }
    if (err) return next(err);
    next();
  });
};

router.get('/', getDocuments);
router.get('/:id', getDocument);
router.post('/', auth, uploadMiddleware, addDocument);
router.delete('/:id', auth, removeDocument);

module.exports = router;