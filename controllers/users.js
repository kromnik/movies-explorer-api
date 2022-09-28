const { NODE_ENV } = process.env;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/secretKey');
const errorMessage = require('../utils/errorMessages');

const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => new NotFoundError(errorMessage.NOT_FOUND))
    .then((user) => {
      res.send(user.deletePasswordFromUser());
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send(user.deletePasswordFromUser());
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessage.BAD_REQUEST));
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError(errorMessage.CONFLICT));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError(errorMessage.NOT_FOUND))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessage.BAD_REQUEST));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          httpOnly: true,
          sameSite: false,
          secure: NODE_ENV === 'production' || false,
        })
        .send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError(errorMessage.UNAUTHORIZED));
    });
};

const signOut = (req, res) => {
  res
    .clearCookie('jwt', {
      httpOnly: true,
      sameSite: false,
      secure: NODE_ENV === 'production' || false,
    })
    .send({ message: 'Выход' });
};

module.exports = {
  getCurrentUser,
  createUser,
  updateProfile,
  login,
  signOut,
};
