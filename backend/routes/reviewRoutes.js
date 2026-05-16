import express from 'express';
import { addReview, getMovieReviews, deleteReview } from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(protect, addReview);
router.route('/:movieId').get(getMovieReviews);
router.route('/:id').delete(protect, admin, deleteReview);

export default router;
