import express from 'express';
import {createSession, getSessions, updateSession, deleteSession} from '../controllers/session.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createSession)
router.get('/', getSessions);
router.put('/:id', updateSession)
router.delete('/:id', deleteSession);

export default router;