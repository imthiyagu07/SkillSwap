import express from 'express';
import { getMatches, searchUsers } from '../controllers/match.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getMatches);
router.get('/search', searchUsers);

export default router;