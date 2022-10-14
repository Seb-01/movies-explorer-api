// для теста!!
// const mongoose = require('mongoose');

const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request');
const InternalServerError = require('../errors/internal-server');
const DuplicateError = require('../errors/duplicate-uniq-dbfield');
const UnAuthoRizedError = require('../errors/unauthorized');
const NotFoundError = require('../errors/not-found');

const { NODE_ENV, JWT_SECRET } = process.env;

// создает пользователя с переданными в теле email, password и name
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  // сначала ищем юзера в базе, если он уже есть - выкидываем ошибку, иначе создаем!
  User.findOne({ email })
    .then((newUser) => {
      if (newUser) {
        return next(new DuplicateError('Ошибка при создании пользователя: пользователь с таким email уже существует!'));
      }
      // работаем дальше: хешируем пароль
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, email, password: hash })
      .then((user) => res.status(201).send({
        name: user.name,
        email: user.email,
        id: user._id,
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Произошла ошибка при создании пользователя: некорректные данные!'));
        } else if (err.code === 11000) {
          next(new DuplicateError('Произошла ошибка при создании пользователя: пользователь с таким email уже существует!'));
        } else {
          // отправляем ошибку в централизованный обработчик
          next(err);
        }
      }));
};

// обновляем информацию о пользователе (email и имя)
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    // Передадим объект опций:
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => {
      if (user) {
        return res.send({
          name: user.name,
          email: user.email,
          id: user._id,
        });
      }
      return next(new NotFoundError('Произошла ошибка при обновлении пользователя: пользователь не найден!'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка при обновлении пользователя: некорректные данные!'));
      }
      next(new InternalServerError('Произошла внутренняя ошибка сервера!'));
    });
};

// возвращает информацию по текущему пользователю (email и имя)
module.exports.getCurrentUser = (req, res, next) => {
  // для теста!
  // console.log('getCurrentUser');
  // const _id = mongoose.Types.ObjectId('6347b0035e5e6f54b34a2036');
  // console.log(_id);
  // ------------------------
  // req.user._id - подставляется автоматически в auth()
  // User.findById(req.user._id)
  // Для теста:
  const _id = '6347b0035e5e6f54b34a2036';
  User.findById(_id)
    .then((user) => {
      if (user) {
        // Просто send не останавливает выполнение кода!!
        return res.send({
          name: user.name,
          email: user.email,
          id: user._id,
        });
      }
      return next(new NotFoundError('Произошла ошибка при запросе инфо о пользователе: пользователь не найден!'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка при запросе инфо о пользователе: некорректные данные!'));
      }
      next(new InternalServerError('Произошла внутренняя ошибка сервера!'));
    });
};

// loginUser: проверяет переданные в теле почту и пароль и возвращает JWT
module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password') // хеш пароля теперь нужен!
    .then((user) => {
      if (!user) {
        // пользователь с такой почтой не найден
        return next(new UnAuthoRizedError('Ошибка авторизации: неправильные почта или пароль!'));
      }
      // пользователь найден
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем промис
            next(new UnAuthoRizedError('Ошибка авторизации: неправильные почта или пароль!'));
          }
          // аутентификация успешна - создаем JWT сроком на неделю
          console.log(`user._id ${user._id}`);
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' }, // контроллер должен создавать JWT сроком на неделю
          );
          // вернём токен
          return res.send({ token });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка при авторизации: некорректные данные!'));
      }
      next(new InternalServerError('Произошла внутрення ошибка сервера!'));
    });
};
