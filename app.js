require('dotenv').config();

const allowedCors = [
  'https://movies-explorer-pgk.nomoredomains.xyz',
  'http://movies-explorer-pgk.nomoredomains.xyz',
  'http://localhost:3001',
  'http://localhost:3000',
];

const corsOptions = {
  credentials: true,
  origin: allowedCors,
};

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const errorHandler = require('./middlewares/error');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

app.use(cors(corsOptions));

mongoose.connect('mongodb://0.0.0.0:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use(router);

app.use((req, res, next) => {
  next(new NotFoundError('Путь не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3000');
});
