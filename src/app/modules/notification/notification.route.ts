import express from 'express';
import { NotificationController } from './notification.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.route('/').get(
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.USER,
    USER_ROLES.PROVIDER
  ),

  NotificationController.getNotifications
);
router.route('/:id').patch(auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.USER,
    USER_ROLES.PROVIDER
  ), NotificationController.markNotificationAsRead);

export const NotificationRoutes = router;
