const bcrypt = require("bcryptjs"); // импортируем bcrypt
const jwt = require("jsonwebtoken"); // импортируем модуль jsonwebtoken
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request");
const InternalServerError = require("../errors/internal-server");
const DuplicateError = require("../errors/duplicate-uniq-dbfield");
const UnAuthoRizedError = require("../errors/unauthorized");
const NotFoundError = require("../errors/not-found");
const {
  USER_CREATE_ERROR_NOT_UNIQUE,
  USER_CREATE_ERROR_BAD_REQUESTS,
  USER_UPDATE_ERROR_NOT_UNIQUE,
  USER_UPDATE_ERROR_USER_NOT_FOUND,
  USER_UPDATE_ERROR_BAD_REQUESTS,
  USER_GET_INFO_ERROR_USER_NOT_FOUND,
  USER_GET_INFO_ERROR_USER_BAD_REQUESTS,
  USER_GET_INFO_ERROR_INTERNAL_SERVER_ERROR,
  AUTH_ERROR_WRONG_CREDENTIAL,
  AUTH_ERROR_BAD_REQUESTS,
  AUTH_ERROR_INTERNAL_SERVER_ERROR,
  USER_AUTH_BAD_EMAIL,
} = require("../utils/errors-name");

// const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_SECRET } = require("../utils/env-config");

// создает пользователя с переданными в теле email, password и name
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  // хешируем пароль
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      if (!hash) {
        return next(new BadRequestError(USER_CREATE_ERROR_BAD_REQUESTS));
      }
      // создаем пользователя
      return User.create({ name, email, password: hash })
        .then((user) =>
          res.status(201).send({
            name: user.name,
            email: user.email,
            id: user._id,
          })
        )
        .catch((err) => {
          if (err.name === "ValidationError") {
            // console.log(JSON.stringify(err));
            next(new BadRequestError(USER_CREATE_ERROR_BAD_REQUESTS));
          } else if (err.code === 11000) {
            next(new DuplicateError(USER_CREATE_ERROR_NOT_UNIQUE));
          } else {
            // отправляем ошибку в централизованный обработчик
            next(err);
          }
        });
    })
    .catch((err) => next(err));
};

// обновляем информацию о пользователе (email и имя)
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  // защита от дубля email при редактировании профиля
  User.findOne({ email })
    .then((newUser) => {
      if (newUser) {
        return next(new DuplicateError(USER_UPDATE_ERROR_NOT_UNIQUE));
      }
      return User.findByIdAndUpdate(
        req.user._id,
        { name, email },
        {
          // Передадим объект опций:
          new: true, // обработчик then получит на вход обновлённую запись
          runValidators: true, // данные будут валидированы перед изменением
        }
      );
    })
    .then((user) => {
      if (user) {
        return res.send({
          name: user.name,
          email: user.email,
          id: user._id,
        });
      }
      return next(new NotFoundError(USER_UPDATE_ERROR_USER_NOT_FOUND));
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(USER_UPDATE_ERROR_BAD_REQUESTS));
      } else if (err.code === 11000) {
        next(new DuplicateError(USER_UPDATE_ERROR_NOT_UNIQUE));
      } else {
        // отправляем ошибку в централизованный обработчик
        next(err);
      }
    });
};

// возвращает информацию по текущему пользователю (email и имя)
module.exports.getCurrentUser = (req, res, next) => {
  // req.user._id - подставляется автоматически в auth()
  // Для теста:
  // const _id = '6347b0035e5e6f54b34a2036';
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        // Просто send не останавливает выполнение кода!!
        return res.send({
          name: user.name,
          email: user.email,
          id: user._id,
        });
      }
      return next(new NotFoundError(USER_GET_INFO_ERROR_USER_NOT_FOUND));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError(USER_GET_INFO_ERROR_USER_BAD_REQUESTS));
      }
      return next(err);
    });
};

// loginUser: проверяет переданные в теле почту и пароль и возвращает JWT
module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password") // хеш пароля теперь нужен!
    .then((user) => {
      if (!user) {
        // пользователь с такой почтой не найден
        return next(new UnAuthoRizedError(USER_AUTH_BAD_EMAIL));
      }
      // пользователь найден
      return bcrypt.compare(password, user.password).then((result) => {
        if (result) {
          // аутентификация успешна - создаем JWT сроком на неделю
          // console.log(password);
          // console.log(user.password);
          // console.log(`user._id ${user._id}`);
          // console.log(`JWT_SECRET ${JWT_SECRET}`);
          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: "7d" } // контроллер должен создавать JWT сроком на неделю
          );
          // вернём токен
          // console.log(`token ${token}`);
          return res.status(200).json({ token });
        } else {
          return next(new UnAuthoRizedError(AUTH_ERROR_WRONG_CREDENTIAL));
        }
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError(AUTH_ERROR_BAD_REQUESTS));
      }
      return next(err);
    });
};
