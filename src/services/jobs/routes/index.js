const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const { jobSchema } = require('../validator/schema');
const {
  getJobs, getJobsByCompanyHandler, getJobsByCategoryHandler,
  getJob, addJob, editJob, removeJob
} = require('../controllers/jobs-controllers');

router.get('/', getJobs);
router.get('/company/:companyId', getJobsByCompanyHandler);
router.get('/category/:categoryId', getJobsByCategoryHandler);
router.get('/:id', getJob);
router.post('/', auth, validate(jobSchema), addJob);
router.put('/:id', auth, validate(jobSchema), editJob);
router.delete('/:id', auth, removeJob);

module.exports = router;