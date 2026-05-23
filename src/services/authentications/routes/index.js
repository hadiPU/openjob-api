const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const auth = require('../../../middlewares/auth');
const { loginSchema, refreshTokenSchema } = require('../validator/schema');
const { loginHandler, refreshHandler, logoutHandler } = require('../controllers/authentication-controllers');

router.post('/', validate(loginSchema), loginHandler);
router.put('/', validate(refreshTokenSchema), refreshHandler);
router.delete('/', auth, logoutHandler);

module.exports = router;