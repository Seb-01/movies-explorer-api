// метод Router создаёт объект, на который повесим обработчики запросов к серверу
const router = require("express").Router();
const userRouter = require("./users");
const movieRouter = require("./movies");
const auth = require("../middlewares/auth");
const { loginUser, createUser } = require("../controllers/users");
const { validateUserCreate, validateUserLogin } = require("../middlewares/celebrate");
const notFound = require("../middlewares/not-found");

// роут для логина и регистрации - до auth()!!
router.post("/signup", validateUserCreate, createUser);
router.post("/signin", validateUserLogin, loginUser);

// обеспечиваем авторизацию при запросах ниже
router.use(auth);

// все остальные роутеры
router.use("/", userRouter, movieRouter);

// если страница не найдена - возвращаем ошибку!
router.use(notFound);

module.exports = router;
