import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { MessageController } from './message.controller';
import { getSingleFilePath } from '../../../shared/getFilePath';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
const router = express.Router();

router.post('/',
  auth(USER_ROLES.USER, USER_ROLES.PROVIDER),
  fileUploadHandler(),
  async (req, res, next) => {
    try {
      const image = getSingleFilePath(req.files, "image");
      req.body = {
        sender: req.user.id,
        image,
        ...req.body
      };
      next();
    } catch (error) {
      res.status(400).json({ message: "Failed to upload Category Image" });
    }
  },
  MessageController.sendMessage
);
router.get(
  '/:id',
  auth(USER_ROLES.USER, USER_ROLES.PROVIDER),
  MessageController.getMessage
);

export const MessageRoutes = router;
