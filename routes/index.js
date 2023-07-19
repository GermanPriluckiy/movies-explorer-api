/* eslint-disable no-useless-escape */
const router = require('express').Router();
const {
  joiSignupValidation,
  joiSigninValidation,
} = require('../utils/userValidation');
const userRoutes = require('./users');
const moviesRoutes = require('./movies');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signup', joiSignupValidation, createUser);
router.post('/signin', joiSigninValidation, login);

router.get('/signout', logout);

router.use(auth);

router.use('/users', userRoutes);
router.use('/movies', moviesRoutes);

module.exports = router;
