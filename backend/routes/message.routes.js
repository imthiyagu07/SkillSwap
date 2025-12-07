import express from 'express';
import {getOrCreateConversation, getConversations, sendMessage, getMessages, markAsRead} from '../controllers/message.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/conversation', getOrCreateConversation);
router.get('/conversations', getConversations);
router.post('/', sendMessage);
router.get('/:conversationId', getMessages);
router.put('/:conversationId/read', markAsRead);

export default router;