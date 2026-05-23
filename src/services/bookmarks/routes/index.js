const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const {
  getBookmarks, getBookmark, addBookmark, removeBookmark
} = require('../controllers/bookmark-controllers');

router.get('/bookmarks', auth, getBookmarks);
router.post('/jobs/:jobId/bookmark', auth, addBookmark);
router.get('/jobs/:jobId/bookmark/:id', auth, getBookmark);
router.delete('/jobs/:jobId/bookmark', auth, removeBookmark);

module.exports = router;