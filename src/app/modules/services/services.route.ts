import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import {
  createPortfolioZodSchema,
  createServiceZodSchema,
  updateServiceZodSchema,
} from './services.validation';
import { serviceController } from './services.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

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

    serviceController.createService,
  )
  .get(serviceController.getServices);

router.route('/recommended').get(serviceController.getRecommendedServices);
router.route('/trending').get(serviceController.getTrendingServices);

// for provider
router
  .route('/provider')
  .get(auth(USER_ROLES.PROVIDER), serviceController.getServicesByProvider);

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
    serviceController.updateServices,
  )
  .delete(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.PROVIDER),
    serviceController.deleteServices,
  );



router.route('/category/:id').get(serviceController.getServiceByCategory);

// for portfolio

router
  .route('/portfolio/provider')
  .get(serviceController.getPortfoliosByProvider);

router.route('/portfolio').post(
  auth(USER_ROLES.PROVIDER),
  fileUploadHandler(),

  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = createPortfolioZodSchema.parse(JSON.parse(req.body.data));
    }
    return serviceController.createPortfolio(req, res, next);
  },

  serviceController.createPortfolio,
);

router
  .route('/portfolio/:id')
  .get(serviceController.getSinglePortfolio)
  .patch(
    auth(USER_ROLES.PROVIDER),
    fileUploadHandler(),

    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = updateServiceZodSchema.parse(JSON.parse(req.body.data));
      }
      return serviceController.updatePortfolio(req, res, next);
    },

    serviceController.updatePortfolio,
  )
  .delete(
    auth(USER_ROLES.PROVIDER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    serviceController.deletePortfolio,
  );

export const productRoutes = router;
