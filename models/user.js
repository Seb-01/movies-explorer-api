const mongoose = require('mongoose');
const validator = require('validator');

const {
  SCHEMA_ERROR_WRONG_EMAIL,
} = require('../utils/errors-name');

const userSchema = new mongoose.Schema(
  {
    name: { // у пользователя есть имя — опишем требования к имени в схеме:
      type: String, // имя — это строка
      required: true,
      minlength: 2, // минимальная длина имени — 2 символа
      maxlength: 30, // а максимальная — 30 символов
    },
    email: {
      type: String,
      required: true, // оно должно быть у каждого пользователя, emai — обязательное поле
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: SCHEMA_ERROR_WRONG_EMAIL,
      },
    },
    password: {
      type: String,
      required: true, // оно должно быть у каждого пользователя
      select: false, // необходимо добавить поле select чтобы API не возвращал хеш пароля
    },

  },
  { versionKey: false }, // You should be aware of the outcome after set to false
);

module.exports = mongoose.model('user', userSchema);
