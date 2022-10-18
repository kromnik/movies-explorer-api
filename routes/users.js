const usersRouter = require('express').Router();
const { getCurrentUser, updateProfile } = require('../controllers/users');
const { validateUpdateProfile } = require('../middlewares/validators');

usersRouter.get('/users/me', getCurrentUser);
usersRouter.patch('/users/me', validateUpdateProfile, updateProfile);

module.exports = usersRouter;
