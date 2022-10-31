const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
require('dotenv').config();

const router = require('./routes/index');
const handleError = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimiter');
const { MONGO_URL } = require('./utils/secretKey');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(MONGO_URL);

app.use(
  cors({
    origin: [
      'http://movies-explorer.kiro.nomorepartiesxyz.ru',
      'https://movies-explorer.kiro.nomorepartiesxyz.ru',
      'http://localhost:3010',
      'https://localhost:3010',
    ],
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
    credentials: true,
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);
app.use(helmet());
app.use(limiter);
app.use(router);
app.use(errorLogger);

app.use(errors());
app.use(handleError);

app.listen(PORT);
