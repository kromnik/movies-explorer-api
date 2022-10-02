const router = require('express').Router();

const { createUser, login } = require('../controllers/users');
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const errorMessage = require('../utils/errorMessages');
const auth = require('../middlewares/auth');
const { validateSignUp, validateSignIn } = require('../middlewares/validators');

router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);

router.use(auth);

router.use('/', userRouter);
router.use('/', movieRouter);

router.use((req, res, next) => {
  next(new NotFoundError(errorMessage.NOT_FOUND));
});

module.exports = router;
