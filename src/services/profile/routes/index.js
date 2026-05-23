const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const {
  getProfileHandler, getProfileApplicationsHandler, getProfileBookmarksHandler
} = require('../controllers/profile-controllers');

router.use(auth);
router.get('/', getProfileHandler);
router.get('/applications', getProfileApplicationsHandler);
router.get('/bookmarks', getProfileBookmarksHandler);

module.exports = router;