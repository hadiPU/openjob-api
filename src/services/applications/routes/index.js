const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const { applicationSchema, applicationStatusSchema } = require('../validator/schema');
const {
  addApplication, getApplications, getApplicationsByUserHandler,
  getApplicationsByJobHandler, getApplication, editApplicationStatus,
  removeApplication
} = require('../controllers/application-controllers');

router.post('/', auth, validate(applicationSchema), addApplication);
router.get('/', auth, getApplications);
router.get('/user/:userId', auth, getApplicationsByUserHandler);
router.get('/job/:jobId', auth, getApplicationsByJobHandler);
router.get('/:id', auth, getApplication);
router.put('/:id', auth, validate(applicationStatusSchema), editApplicationStatus);
router.delete('/:id', auth, removeApplication);

module.exports = router;