const errorMessage = require('../utils/errorMessages');

const handleError = ((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? errorMessage.SERVER_ERROR : message });
  next();
});

module.exports = handleError;
