import express from 'express';
import auth from '../../middlewares/auth';
import { ChatController } from './chat.controller';
import { USER_ROLES } from '../../../enums/user';
const router = express.Router();

router.route("/")
  .post(
    auth(USER_ROLES.USER),
    async (req, res, next) => {
      try {
        req.body = [req.user.id, req.body.participants];
        next();
      } catch (error) {
        res.status(400).json({ message: "Failed to create chat" });
      }
    },
    ChatController.createChat
  )
  .get(
    auth(USER_ROLES.USER, USER_ROLES.PROVIDER),
    ChatController.getChat
  );

export const ChatRoutes = router;
