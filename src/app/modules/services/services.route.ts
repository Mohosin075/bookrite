import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { createServiceZodSchema } from './services.validation';
import { productController } from './services.controller';

const router = express.Router();

router
  .route('/')
  .post(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    validateRequest(createServiceZodSchema),
    productController.createService
  )
  .get(productController.getServices);

router
  .route('/:id')
  .get(productController.getSingleServices)
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    productController.updateServices
  )
  .delete(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    productController.deleteServices
  );

export const productRoutes = router;
