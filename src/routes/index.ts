import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { categoryRoutes } from '../app/modules/categories/categories.route';
import { productRoutes } from '../app/modules/services/services.route';
import { bannerRoutes } from '../app/modules/banner/banner.route';
import { bookingRoutes } from '../app/modules/booking/booking.route';
import { serviceReviewRoutes } from '../app/modules/review/review.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/services',
    route: productRoutes,
  },
  {
    path: '/banner',
    route: bannerRoutes,
  },
  {
    path: '/booking',
    route: bookingRoutes,
  },
  {
    path: '/reviews',
    route: serviceReviewRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
