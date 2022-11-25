const rateLimit = require("express-rate-limit");
const { RATE_LIMIT_ERROR } = require("../utils/errors-name");

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: RATE_LIMIT_ERROR,
});

module.exports = rateLimiter;
