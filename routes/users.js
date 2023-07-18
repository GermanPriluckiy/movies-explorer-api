/* eslint-disable no-useless-escape */
const router = require('express').Router();
const { joiUserValidation } = require('../utils/userValidation');
const { updateUser, getCurrentUser } = require('../controllers/users');

router.get('/me', getCurrentUser);

router.patch('/me', joiUserValidation, updateUser);

module.exports = router;
