// метод Router создаёт объект, на который повесим обработчики запросов к серверу
const router = require('express').Router();
const { validateMovieCreate, validateMovieDeleteById } = require('../middlewares/celebrate');

const { createMovie, getMovies, deleteMovie } = require('../controllers/movies');

router.get('/movies/', getMovies);
router.post('/movies/', validateMovieCreate, createMovie);
router.delete('/movies/:movieId', validateMovieDeleteById, deleteMovie);

module.exports = router;
