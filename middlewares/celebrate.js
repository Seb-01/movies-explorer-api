// A library of string validators and sanitizers.
const validator = require('validator');
const { ObjectId } = require('mongoose').Types;

// Чтобы отправить клиенту ошибку, в celebrate есть специальный мидлвэр — errors
const {
  celebrate, Joi, Segments,
} = require('celebrate');

// проверка url
const urlValidator = (value) => {
  const result = validator.isURL(value);
  if (result) return value;
  throw new Error('URL validation error');
};

// проверка ObjectId
const idValidator = (value) => {
  if (ObjectId.isValid(value)) return value;
  throw new Error('Owner ObjectId validation error');
};

// создаёт пользователя с переданными в теле email, password и name
const validateUserCreate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

// проверка роутера при обновлении информации о пользователе (email и имя)
const validateUserUpdate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

// проверяет переданные в теле почту и пароль
const validateUserLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

// проверка роутера при запросе на создание фильма с переданными в теле данными фильма
const validateMovieCreate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required().min(4),
    description: Joi.string().required(),
    image: Joi.string().custom(urlValidator),
    trailerLink: Joi.string().custom(urlValidator),
    thumbnail: Joi.string().custom(urlValidator),
    owner: Joi.any().required().custom(idValidator),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

// проверка роутера при удалении сохранённого фильма по id
const validateMovieDeleteById = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24),
  }),
});

// отправка на экспорт
module.exports = {
  validateUserCreate,
  validateUserUpdate,
  validateUserLogin,
  validateMovieCreate,
  validateMovieDeleteById,
};
