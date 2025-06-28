import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import {
  createCategoryZodSchema,
  updateCategoryZodSchema,
} from './categories.validation';
import { CategoryController } from './categories.controller';
import validateRequest from '../../middlewares/validateRequest';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
const router = express.Router();

router
  .route('/')
  .post(
    auth(
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.USER,
      USER_ROLES.PROVIDER,
    ),
    fileUploadHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = createCategoryZodSchema.parse(JSON.parse(req.body.data));
      }
      return CategoryController.createCategory(req, res, next);
    },
  )
  .get(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
    CategoryController.getCategory,
  );

router
  .route('/:id')
  .get(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
    CategoryController.getSingleCategory,
  )
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    validateRequest(updateCategoryZodSchema),
    CategoryController.updateCategory,
  )
  .delete(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    CategoryController.deleeteCategory,
  );

export const categoryRoutes = router;
