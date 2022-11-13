const NotFoundError = require('../errors/not-found');
const { PAGE_NOT_FOUND } = require('../utils/errors-name');

const notFound = (req, res, next) => {
  next(new NotFoundError(PAGE_NOT_FOUND));
};

module.exports = notFound;
