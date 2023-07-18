const NotFoundError = require('../errors/NotFoundError');
const NotOwnerError = require('../errors/NotOwnerError');
const IncorrectDataError = require('../errors/IncorrectDataError');
const Movie = require('../models/movie');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    owner: req.user._id,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((newMovie) => res.status(201).send({ data: newMovie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new IncorrectDataError('некорректные данные при создании карточки'),
        );
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (movie === null) {
        throw new NotFoundError('Нет фильма с таким id');
      } else if (movie.owner.equals(req.user._id)) {
        Movie.deleteOne(movie)
          .then((deletedMovie) => res.send(deletedMovie))
          .catch(next);
      } else {
        throw new NotOwnerError('Нельзя удалять чужой фильм');
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
