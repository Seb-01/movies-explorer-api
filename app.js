require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// обработчик ошибок celebrate
const { errors } = require('celebrate');

const NotFoundError = require('./errors/not-found');
const { loginUser, createUser } = require('./controllers/users');
const { validateUserCreate, validateUserLogin } = require('./middlewares/celebrate');
const auth = require('./middlewares/auth');

const { requestLogger, errorLogger } = require('./middlewares/logger');
// const cors = require('./middlewares/cors');

const app = express();

// Подключаем БД:
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors);
app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// роут для логина и регистрации
app.post('/signin', validateUserLogin, loginUser);
app.post('/signup', validateUserCreate, createUser);

// обеспечиваем авторизацию при запросах ниже
app.use(auth);

// роутинг организуем
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена!'));
});

// после обработчиков роутов и до обработчиков ошибок!!!
app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// здесь централизовано обрабатываем все ошибки
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

module.exports = app;
