const mongoose = require('mongoose');
const validate = require('mongoose-validator');

// option.validator {string} or {function} - required
// Name of the validator or a custom function you wish to use, this can be any
// one of the built-in validator.js validators, or a custom validator.
const urlValidator = [
  validate({
    validator: (value) => validate.isURL(value, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true }),
    message: 'Must be a Valid URL',
  }),
];

const movieShema = new mongoose.Schema(
  {
    country: { // country — страна создания фильма. Обязательное поле-строка.
      type: String, // строка
      required: true,
    },
    director: { // director — режиссёр фильма. Обязательное поле-строка
      type: String, // строка
      required: true,
    },
    duration: { // duration — длительность фильма. Обязательное поле-число
      type: Number,
      required: true,
    },
    year: { // year — год выпуска фильма. Обязательное поле-строка
      type: String, // строка
      required: true,
    },
    description: { // description — описание фильма. Обязательное поле-строка.
      type: String, // строка
      required: true,
    },
    image: { // image — ссылка на постер к фильму. Обязательное поле-строка. URL-адрес.
      type: String,
      required: true,
      validate: urlValidator,
    },
    trailerLink: { // trailerLink — ссылка на трейлер фильма. Обязательное поле-строка. URL-адрес.
      type: String,
      required: true,
      validate: urlValidator,
    },
    thumbnail: { // thumbnail — миниат изображение постера к фильму. Обяз поле-строка. URL-адрес.
      type: String,
      required: true,
      validate: urlValidator,
    },
    owner: { //  _id пользователя, который сохранил фильм. Обязательное поле.
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: { //  movieId — id фильма, кот. содержится в ответе сервиса MoviesExplorer. Обяз. поле
      type: Number, // Id присваивается не нашим приложением, а другим сервисом! поэтому Number
      required: true,
    },
    nameRU: { // nameRU — название фильма на русском языке. Обязательное поле-строка.
      type: String, // строка
      required: true,
    },
    nameEN: { // nameEN — название фильма на английском языке. Обязательное поле-строка
      type: String, // строка
      required: true,
    },

  },
  { versionKey: false }, // You should be aware of the outcome after set to false
);

module.exports = mongoose.model('movie', movieShema);
