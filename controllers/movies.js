const Movie = require("../models/movie");
const BadRequestError = require("../errors/bad-request");
const InternalServerError = require("../errors/internal-server");
const NotFoundError = require("../errors/not-found");
const PermissionError = require("../errors/permission");

const {
  MOVIE_CREATE_ERROR_BAD_REQUESTS,
  MOVIE_CREATE_ERROR_INTERNAL_SERVER_ERROR,
  MOVIE_DELETE_ERROR_NOT_FOUND,
  MOVIE_DELETE_ERROR_BAD_REQUESTS,
  MOVIE_DELETE_ERROR_INTERNAL_SERVER_ERROR,
  MOVIE_DELETE_ERROR_FORBIDDEN,
} = require("../utils/errors-name");

// создаёт фильм с переданными в теле country, director, duration, year, description,
// image, trailer, nameRU, nameEN и thumbnail, movieId
module.exports.createMovie = (req, res, next) => {
  // const ownerId = req.user._id;
  // это для теста const ownerID = '6347b0035e5e6f54b34a2036';
  alert("Пришли в createMovie");
  console.log(JSON.stringify(req.body));
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => movie.populate(["owner"]))
    .then((movie) => {
      console.log(JSON.stringify(movie));
      res.send(movie);
      return;
    })
    .catch((err) => {
      console.log(JSON.stringify(err));
      if (err.name === "ValidationError") {
        return next(new BadRequestError(MOVIE_CREATE_ERROR_BAD_REQUESTS));
      }
      // console.log(err);
      return next(
        new InternalServerError(MOVIE_CREATE_ERROR_INTERNAL_SERVER_ERROR)
      );
    });
};

// возвращает все сохранённые текущим пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .populate(["owner"])
    .then((movies) => res.send(movies))
    .catch(() =>
      next(new InternalServerError(MOVIE_CREATE_ERROR_INTERNAL_SERVER_ERROR))
    );
};

// удаляет сохранённый фильм по id
module.exports.deleteMovie = (req, res, next) => {
  // найдем фильм для начала
  // console.log(req.params.movieId);
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie) {
        // если этот фильм создан текущим пользователем
        // valueOf() потому что movie.owner._id сравниваем с req.user._id
        if (movie.owner._id.valueOf() === req.user._id) {
          Movie.findByIdAndRemove(req.params.movieId)
            .then((delMovie) => res.send(delMovie))
            .catch((err) => {
              // console.log(err);
              if (err.name === "CastError") {
                return next(
                  new BadRequestError(MOVIE_DELETE_ERROR_BAD_REQUESTS)
                );
              }
              return next(
                new InternalServerError(
                  MOVIE_DELETE_ERROR_INTERNAL_SERVER_ERROR
                )
              );
            });
        } else {
          next(new PermissionError(MOVIE_DELETE_ERROR_FORBIDDEN));
        }
      } else {
        next(new NotFoundError(MOVIE_DELETE_ERROR_NOT_FOUND));
      }
    })
    .catch((err) => {
      // console.log(err);
      if (err.name === "CastError") {
        return next(new BadRequestError(MOVIE_DELETE_ERROR_BAD_REQUESTS));
      }
      return next(
        new InternalServerError(MOVIE_DELETE_ERROR_INTERNAL_SERVER_ERROR)
      );
    });
};
