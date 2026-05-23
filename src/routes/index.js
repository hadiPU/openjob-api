const express = require('express');
const router = express.Router();

router.use('/users', require('../services/users/routes'));
router.use('/companies', require('../services/companies/routes'));
router.use('/categories', require('../services/categories/routes'));
router.use('/jobs', require('../services/jobs/routes'));
router.use('/applications', require('../services/applications/routes'));
router.use('/', require('../services/bookmarks/routes'));
router.use('/bookmarks', require('../services/bookmarks/routes'));
router.use('/documents', require('../services/documents/routes'));
router.use('/authentications', require('../services/authentications/routes'));
router.use('/profile', require('../services/profile/routes'));

module.exports = router;