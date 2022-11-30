module.exports = {
  USER_CREATE_ERROR_NOT_UNIQUE:
    "Ошибка при создании пользователя: пользователь с таким email уже существует!",
  USER_CREATE_ERROR_BAD_REQUESTS:
    "Произошла ошибка при создании пользователя: некорректные данные!",
  USER_UPDATE_ERROR_NOT_UNIQUE:
    "Ошибка при обновлении пользователя: пользователь с таким email уже существует!",
  USER_UPDATE_ERROR_BAD_REQUESTS:
    "Произошла ошибка при обновлении пользователя: некорректные данные!",
  USER_UPDATE_ERROR_USER_NOT_FOUND:
    "Произошла ошибка при обновлении пользователя: пользователь не найден!",
  USER_GET_INFO_ERROR_USER_NOT_FOUND:
    "Произошла ошибка при запросе инфо о пользователе: пользователь не найден!",
  USER_GET_INFO_ERROR_USER_BAD_REQUESTS:
    "Произошла ошибка при запросе инфо о пользователе: некорректные данные!",
  USER_GET_INFO_ERROR_INTERNAL_SERVER_ERROR:
    "Произошла ошибка при запросе инфо о пользователе: внутренняя ошибка сервера!",
  USER_AUTH_BAD_EMAIL: "Пользователь с таким email не найден!",
  AUTH_ERROR_COMMON: "Необходима авторизация!",
  AUTH_ERROR_WRONG_TOKEN:
    "При авторизации произошла ошибка. Переданный токен некорректен.",
  AUTH_ERROR_WRONG_CREDENTIAL:
    "Ошибка авторизации: неправильные почта или пароль!",
  AUTH_ERROR_BAD_REQUESTS:
    "Произошла ошибка при авторизации: некорректные данные!",
  AUTH_ERROR_INTERNAL_SERVER_ERROR:
    "Ошибка авторизации: внутренняя ошибка сервера!",
  MOVIE_CREATE_ERROR_BAD_REQUESTS:
    "Создание фильма. Произошла ошибка: некорректные данные!",
  MOVIE_CREATE_ERROR_INTERNAL_SERVER_ERROR:
    "Создание фильма. Произошла внутренняя ошибка сервера!",
  MOVIE_DELETE_ERROR_NOT_FOUND:
    "Произошла ошибка при удалении фильма: фильм с таким id не найден!",
  MOVIE_DELETE_ERROR_BAD_REQUESTS:
    "Произошла ошибка при удалении фильма: некорректные данные!",
  MOVIE_DELETE_ERROR_FORBIDDEN:
    "Произошла ошибка при удалении фильма: удалять можно только свои фильмы!",
  MOVIE_DELETE_ERROR_INTERNAL_SERVER_ERROR:
    "Создание фильма. Произошла внутренняя ошибка сервера!",
  URL_VALIDATION_BAD_REQUESTS: "Ошибка валидации: некорректный url!",
  RATE_LIMIT_ERROR: "Превышено количество запросов с вашего IP!",
  SCHEMA_ERROR_WRONG_EMAIL: "Неправильный формат email!",
  INTERNAL_SERVER_ERROR: "Произошла внутренняя ошибка сервера!",
  PAGE_NOT_FOUND: "Страница не найдена!",
  NAME_SHOULD_BE_CORRECT_URL: "Не корректный URL!",
};
