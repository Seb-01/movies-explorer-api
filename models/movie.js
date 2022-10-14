const mongoose = require('mongoose');

const movieShema = new mongoose.Schema(
  {
    country: { // country — страна создания фильма. Обязательное поле-строка.
      type: String, // строка
      required: true,
      default: 'New Country',
    },
    director: { // director — режиссёр фильма. Обязательное поле-строка
      type: String, // строка
      required: true,
      default: 'New Director',
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
    },
    trailerLink: { // trailerLink — ссылка на трейлер фильма. Обязательное поле-строка. URL-адрес.
      type: String,
      required: true,
    },
    thumbnail: { // thumbnail — миниат изображение постера к фильму. Обяз поле-строка. URL-адрес.
      type: String,
      required: true,
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