const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const { registerSchema } = require('../validator/schema');
const { registerUser, getUser } = require('../controllers/user-controllers');

router.post('/', validate(registerSchema), registerUser);
router.get('/:id', getUser);

module.exports = router;