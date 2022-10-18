// require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate'); // обработчик ошибок celebrate
const router = require('./routes/index');
const limiter = require('./middlewares/rate-limiter');
const errorCentralHandler = require('./middlewares/errorCentralHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// const cors = require('./middlewares/cors');

const { DB_HOST, DB_PORT, DB_NAME } = require('./utils/env-config');

const app = express();

// БД: подключаемся к серверу mongo
mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors);
app.use(requestLogger); // подключаем логгер запросов
app.use(limiter);

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

// роутинг организуем
app.use(router);

// после обработчиков роутов и до обработчиков ошибок!
app.use(errorLogger); // подключаем логгер ошибок
// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate
// здесь централизовано обрабатываем все ошибки
app.use(errorCentralHandler);

module.exports = app;
