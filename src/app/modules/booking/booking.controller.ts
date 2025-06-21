import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BookingServices } from './booking.service'; // Importing the correct BookingServices
import sendResponse from '../../../shared/sendResponse'; // Assuming sendResponse is a utility for responses
import catchAsync from '../../../shared/catchAsync'; // Assuming catchAsync is a utility to handle async errors

// Create a booking
const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { service, user, date, startTime } = req.body;
    try {
      const booking = await BookingServices.createBookingFromDB(
        service,
        user,
        date,
        startTime
      );
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Booking created successfully.',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all bookings for a user
const getBookingsByUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;

    try {
      const bookings = await BookingServices.getBookingsByUserFromDB(user);
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Booking data retrieved successfully.',
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get a single booking by ID
const getSingleBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const booking = await BookingServices.getSingleBookingFromDB(id);
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Booking data retrieved successfully.',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update booking status (e.g., from pending to accepted or completed)
const updateBookingStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body; // e.g., 'pending', 'accepted', 'completed'

    try {
      const updatedBooking = await BookingServices.updateBookingStatusFromDB(
        id,
        status
      );
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Booking status updated successfully.',
        data: updatedBooking,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Cancel a booking and free up the time slot
const cancelBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const cancelledBooking = await BookingServices.cancelBookingFromDB(id);
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Booking cancelled successfully.',
        data: cancelledBooking,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all bookings for a specific service
const getBookingsByService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { serviceId } = req.params;

    try {
      const bookings = await BookingServices.getBookingsByServiceFromDB(
        serviceId
      );
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Bookings for the service retrieved successfully.',
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const BookingController = {
  createBooking,
  getBookingsByUser,
  getSingleBooking,
  updateBookingStatus,
  cancelBooking,
  getBookingsByService,
};
