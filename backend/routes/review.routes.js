import express from 'express';
import { createReview, getUserReviews, getMyReviews } from '../controllers/review.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/user/:userId', getUserReviews);
router.get('/my-reviews', protect, getMyReviews);

export default router;