const jwt = require("jsonwebtoken");
const UnAuthoRizedError = require("../errors/unauthorized");

const { AUTH_ERROR_COMMON } = require("../utils/errors-name");

// const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_SECRET } = require("../utils/env-config");

// Авторзационный миддлевеар
// верифицируем токен из заголовков. Если с токеном всё в порядке, мидлвэр должен
// добавлять пейлоуд токена в объект запроса и вызывать next:
module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  // console.log(`auth:${authorization}`);
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnAuthoRizedError(AUTH_ERROR_COMMON));
  }

  // извлечём токен, если он на месте
  const token = authorization.replace("Bearer ", "");

  // верифицируем токен
  let payload;
  try {
    // попытаемся верифицировать токен - payload содержит id пользователя
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new UnAuthoRizedError(AUTH_ERROR_COMMON));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
