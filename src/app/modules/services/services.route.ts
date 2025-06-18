import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import {
  createServiceZodSchema,
  updateServiceZodSchema,
} from './services.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { serviceController } from './services.controller';

const router = express.Router();

router
  .route('/')
  .post(
    auth(USER_ROLES.PROVIDER),
    fileUploadHandler(),

    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = createServiceZodSchema.parse(JSON.parse(req.body.data));
      }
      return serviceController.createService(req, res, next);
    },

    serviceController.createService
  )
  .get(serviceController.getServices);

router
  .route('/:id')
  .get(serviceController.getSingleServices)
  .patch(
    auth(USER_ROLES.PROVIDER),
    fileUploadHandler(),

    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = updateServiceZodSchema.parse(JSON.parse(req.body.data));
      }
      return serviceController.updateServices(req, res, next);
    },
    serviceController.updateServices
  )
  .delete(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.PROVIDER),
    serviceController.deleteServices
  );

export const productRoutes = router;
