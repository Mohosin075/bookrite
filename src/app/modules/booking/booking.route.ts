import express from 'express';
import { BookingController } from './booking.controller'; // Import the controller
import auth from '../../middlewares/auth'; // Auth middleware for role-based access control
import { USER_ROLES } from '../../../enums/user'; // Enum for user roles

const router = express.Router();

// Route to create a booking
router.post(
  '/',
  auth(USER_ROLES.USER),
  BookingController.createBooking
);

// Route to get all bookings for a user
router.get(
  '/',
  auth(USER_ROLES.USER),
  BookingController.getBookingsByUser
);

// Route to get a single booking by ID
router.get(
  '/:id',
  auth(USER_ROLES.USER),
  BookingController.getSingleBooking
);

// Route to update booking status (e.g., from pending to accepted or completed)
router.patch(
  '/:id',
  auth(USER_ROLES.USER, USER_ROLES.PROVIDER),
  BookingController.updateBookingStatus
);

// Route to cancel a booking
router.delete(
  '/:id',
  auth(USER_ROLES.USER),
  BookingController.cancelBooking
);

// Route to get bookings by service
router.get(
  '/service/:serviceId',
  auth(USER_ROLES.USER, USER_ROLES.PROVIDER),
  BookingController.getBookingsByService
);

export const bookingRoutes = router;
