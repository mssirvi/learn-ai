import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';

const router = Router();
const chatController = new ChatController();

// bind the handler so `this` (and geminiService) is available inside the method
router.post('/chat', chatController.handleChat.bind(chatController));

export default router;