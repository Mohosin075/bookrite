import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { ServiceReviewController } from './review.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createReviewZodSchema } from './review.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.USER),
  validateRequest(createReviewZodSchema),
  ServiceReviewController.addReview,
);

router.get('/:serviceId', ServiceReviewController.getReviews);
router.patch(
  '/review/:reviewId',
  auth(USER_ROLES.USER),
  ServiceReviewController.updateReview,
);

export const serviceReviewRoutes = router;
