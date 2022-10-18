require('dotenv').config();

const {
  NODE_ENV, JWT_SECRET_ENV, DB_HOST_ENV, DB_PORT_ENV, DB_NAME_ENV, PORT_ENV,
} = process.env;

const PORT = PORT_ENV || 3001;
const JWT_SECRET = (NODE_ENV === 'production') ? JWT_SECRET_ENV : 'dev-secret';
const DB_HOST = DB_HOST_ENV || 'localhost';
const DB_PORT = DB_PORT_ENV || 27017;
const DB_NAME = DB_NAME_ENV || 'devmoviesdb';

module.exports = {
  PORT, JWT_SECRET, DB_HOST, DB_PORT, DB_NAME,
};
