const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const { categorySchema } = require('../validator/schema');
const {
  getCategories, getCategory, addCategory, editCategory, removeCategory
} = require('../controllers/category-controllers');

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', auth, validate(categorySchema), addCategory);
router.put('/:id', auth, validate(categorySchema), editCategory);
router.delete('/:id', auth, removeCategory);

module.exports = router;