import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import {
  createBannerValidationSchema,
  updateBannerValidationSchema,
} from './banner.validation';
import { BannerController } from './banner.controller';
const router = express.Router();

router
  .route('/')
  .post(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    fileUploadHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = createBannerValidationSchema.parse(
          JSON.parse(req.body.data)
        );
      }
      return BannerController.createBanner(req, res, next);
    }
  )
  .get(BannerController.getBanner);

router
  .route('/:id')
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    fileUploadHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = updateBannerValidationSchema.parse(
          JSON.parse(req.body.data)
        );
      }
      return BannerController.updateBanner(req, res, next);
    },
    BannerController.updateBanner
  )
  .delete(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    BannerController.deleeteBanner
  );

export const bannerRoutes = router;
