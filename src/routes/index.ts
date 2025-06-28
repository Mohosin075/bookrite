import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { categoryRoutes } from '../app/modules/categories/categories.route';
import { productRoutes } from '../app/modules/services/services.route';
import { bannerRoutes } from '../app/modules/banner/banner.route';
import { bookingRoutes } from '../app/modules/booking/booking.route';
import { serviceReviewRoutes } from '../app/modules/review/review.route';
import { paymentRoutes } from '../app/modules/payment/payment.route';
import { ChatRoutes } from '../app/modules/chat/chat.route';
import { MessageRoutes } from '../app/modules/message/message.route';
import { NotificationRoutes } from '../app/modules/notification/notification.route';
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
  {
    path: '/payments',
    route: paymentRoutes,
  },
  {
    path: '/chat',
    route: ChatRoutes,
  },
  {
    path: '/message',
    route: MessageRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
