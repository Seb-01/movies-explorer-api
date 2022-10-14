const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request');
const InternalServerError = require('../errors/internal-server');
const NotFoundError = require('../errors/not-found');
const PermissionError = require('../errors/permission');

// создаёт фильм с переданными в теле country, director, duration, year, description,
// image, trailer, nameRU, nameEN и thumbnail, movieId
module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;

  // const owner = req.user._id;
  const ownerID = '6347b0035e5e6f54b34a2036';
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: ownerID,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => movie.populate(['owner']))
    .then((movie) => {
      // console.log(JSON.stringify(movie));
      res.send({
        country: movie.country,
        director: movie.director,
        duration: movie.duration,
        year: movie.year,
        description: movie.description,
        image: movie.image,
        trailerLink: movie.trailerLink,
        thumbnail: movie.thumbnail,
        owner: {
          name: movie.owner.name,
          email: movie.owner.email,
          id: movie.owner._id,
        },
        movieId: movie.movieId,
        nameRU: movie.nameRU,
        nameEN: movie.nameEN,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Создание фильма. Произошла ошибка: некорректные данные!'));
      }
      // console.log(err);
      next(new InternalServerError('Создание фильма. Произошла внутренняя ошибка сервера!'));
    });
};

// возвращает все сохранённые текущим  пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate(['owner'])
    .then((movies) => res.send(movies))
    .catch(() => next(new InternalServerError('Произошла внутрення ошибка сервера!')));
};

// удаляет сохранённый фильм по id
module.exports.deleteMovie = (req, res, next) => {
  const ownerID = '6347b0035e5e6f54b34a2036';
  // найдем фильм для начала
  // console.log(req.params.movieId);
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie) {
        // если этот фильм создан текущим пользователем
        // valueOf() потому что movie.owner._id = new ObjectId("631efb509e70fef49edc57aa")
        if (movie.owner._id.valueOf() === ownerID) {
        // if (movie.owner._id.valueOf() === req.user._id) {
          Movie.findByIdAndRemove(req.params.movieId)
            .then((delMovie) => {
              if (delMovie) {
                return res.send(delMovie);
              }
              return next(new NotFoundError('Произошла ошибка при удалении фильма: фильм с таким id не найден!'));
            })
            .catch((err) => {
              console.log(err);
              if (err.name === 'CastError') {
                next(new BadRequestError('Произошла ошибка при удалении фильма: некорректные данные!'));
              }
              next(new InternalServerError('Произошла внутрення ошибка сервера!'));
            });
        } else {
          next(new PermissionError('Удалять можно только свои фильмы!'));
        }
      } else {
        next(new NotFoundError('Произошла ошибка при удалении фильма: фильм с таким id не найден!'));
      }
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка при удалении фильма: некорректные данные!'));
      }
      next(new InternalServerError('Произошла внутрення ошибка сервера!'));
    });
};
