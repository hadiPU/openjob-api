const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../../../middlewares/auth');
const {
  getDocuments, getDocument, addDocument, removeDocument
} = require('../controllers/document-controllers');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.get('/', getDocuments);
router.get('/:id', getDocument);
router.post('/', auth, upload.single('document'), addDocument);
router.delete('/:id', auth, removeDocument);

module.exports = router;