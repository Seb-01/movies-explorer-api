const NotFoundError = require('../errors/not-found');

const notFound = (req, res, next) => {
  next(new NotFoundError('Страница не найдена!'));
};

module.exports = notFound;
