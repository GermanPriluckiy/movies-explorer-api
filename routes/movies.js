/* eslint-disable no-useless-escape */
const router = require('express').Router();
const {
  movieJoiValidation,
  movieIdJoiValidation,
} = require('../utils/movieValidation');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', movieJoiValidation, createMovie);
router.delete('/:_id', movieIdJoiValidation, deleteMovie);

module.exports = router;
