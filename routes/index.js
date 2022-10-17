// метод Router создаёт объект, на который повесим обработчики запросов к серверу
const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const { loginUser, createUser } = require('../controllers/users');
const { validateUserCreate, validateUserLogin } = require('../middlewares/celebrate');

// роут для логина и регистрации - до auth()!!
router.post('/signin', validateUserLogin, loginUser);
router.post('/signup', validateUserCreate, createUser);

// обеспечиваем авторизацию при запросах ниже
router.use(auth);

// все остальные роутеры
router.use('/', userRouter, movieRouter);

module.exports = router;
