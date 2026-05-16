import express from 'express';
import { getWatchlist, addToWatchlist, removeFromWatchlist, getUsers } from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/watchlist')
  .get(protect, getWatchlist)
  .post(protect, addToWatchlist);
router.route('/watchlist/:movieId').delete(protect, removeFromWatchlist);

export default router;
