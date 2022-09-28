const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const errorMessage = require('../utils/errorMessages');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Почта указана в некорректном формате ',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.index({ email: 1 }, { unique: true });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(errorMessage.INVALID_CREDENTIALS));
      }
      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(errorMessage.INVALID_CREDENTIALS));
          }
          return user;
        });
    });
};

function deletePasswordFromUser() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}
userSchema.methods.deletePasswordFromUser = deletePasswordFromUser;

module.exports = mongoose.model('user', userSchema);
