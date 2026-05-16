import express from 'express';
import { 
  getTrendingMovies, 
  getTopRatedMovies, 
  getTollywoodMovies,
  searchMovies, 
  getMovieDetails,
  createMovie,
  deleteMovie,
  getMoviesByLanguage
} from '../controllers/movieController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(protect, admin, createMovie);
router.get('/trending', getTrendingMovies);
router.get('/top-rated', getTopRatedMovies);
router.get('/tollywood', getTollywoodMovies);
router.get('/language/:lang', getMoviesByLanguage);
router.get('/search', searchMovies);
router.route('/:id').get(getMovieDetails).delete(protect, admin, deleteMovie);

export default router;
