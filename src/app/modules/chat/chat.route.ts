import express from 'express';
import { ChatController } from './chat.controller';

const router = express.Router();

router.get('/:roomId', ChatController.getMessages);

export const ChatRoutes = router;
