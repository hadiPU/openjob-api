const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const { companySchema, companyUpdateSchema } = require('../validator/schema');
const {
  getCompanies, getCompany, addCompany, editCompany, removeCompany
} = require('../controllers/company-controllers');

router.get('/', getCompanies);
router.get('/:id', getCompany);
router.post('/', auth, validate(companySchema), addCompany);
router.put('/:id', auth, validate(companyUpdateSchema), editCompany);
router.delete('/:id', auth, removeCompany);

module.exports = router;