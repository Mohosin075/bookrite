import express from 'express';
import { BookingController } from './booking.controller'; // Import the controller
import auth from '../../middlewares/auth'; // Auth middleware for role-based access control
import { USER_ROLES } from '../../../enums/user'; // Enum for user roles

const router = express.Router();

// Route to accept a booking
router.patch(
  '/accept/:bookingId',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.PROVIDER,
    USER_ROLES.USER,
  ),
  BookingController.acceptBooking,
);

// Route to reject a booking
router.patch(
  '/reject/:bookingId',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.PROVIDER,
    USER_ROLES.USER,
  ),
  BookingController.rejectBooking,
);

// Route to create a booking
router.post('/', auth(USER_ROLES.USER), BookingController.createBooking);

// Route to get all bookings for a user
router.get('/', auth(USER_ROLES.USER), BookingController.getBookingsByUser);

// Route to get a single booking by ID
router.get('/:id', auth(USER_ROLES.USER), BookingController.getSingleBooking);

// Route to get bookings by service
router.get(
  '/service/:serviceId',
  auth(USER_ROLES.USER, USER_ROLES.PROVIDER),
  BookingController.getBookingsByService,
);

router.patch(
  '/complete/:bookingId',
  auth(USER_ROLES.PROVIDER, USER_ROLES.USER),
  BookingController.completeBooking,
);

router.patch(
  '/cancel/:bookingId',
  auth(USER_ROLES.PROVIDER, USER_ROLES.USER),
  BookingController.cancelBooking,
);

export const bookingRoutes = router;
