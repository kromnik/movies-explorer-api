require('dotenv').config();

const { NODE_ENV, JWT_SECRET, MONGO_URL } = process.env;

const secretKey = {
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
  MONGO_URL: NODE_ENV === 'production' ? MONGO_URL : 'mongodb://127.0.0.1:27017/moviesdb',
};

module.exports = secretKey;
