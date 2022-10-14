// метод Router создаёт объект, на который повесим обработчики запросов к серверу
const router = require('express').Router();
const { validateUserUpdate } = require('../middlewares/celebrate');

const { getCurrentUser, updateUser } = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
router.get('/me', getCurrentUser);
// обновляет информацию о пользователе (email и имя)
router.patch('/me', validateUserUpdate, updateUser);

module.exports = router;
