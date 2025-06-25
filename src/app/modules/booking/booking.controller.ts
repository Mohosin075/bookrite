import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BookingServices } from './booking.service'; // Importing the correct BookingServices
import sendResponse from '../../../shared/sendResponse'; // Assuming sendResponse is a utility for responses
import catchAsync from '../../../shared/catchAsync'; // Assuming catchAsync is a utility to handle async errors

// Create a booking
const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { service, date, startTime } = req.body;
    const {id} = req.user
    try {
      const booking = await BookingServices.createBookingFromDB(
        service,
        id,
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
    const { user , status} = req.body;

    try {
      const bookings = await BookingServices.getBookingsByUserFromDB(user, status);
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




// Accept booking
const acceptBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId } = req.params;
    const providerId = req.user.id; 

    try {
      const booking = await BookingServices.acceptBookingFromDB(bookingId, providerId);
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Booking accepted successfully.',
        data: booking,
      });
    } catch (error) {
      next(error);  // Pass error to the global error handler
    }
  }
);

// Reject booking
const rejectBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId } = req.params;
    const providerId = req.user.id; 

    try {
      const booking = await BookingServices.rejectBookingFromDB(bookingId, providerId);
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Booking rejected successfully.',
        data: booking,
      });
    } catch (error) {
      next(error);  // Pass error to the global error handler
    }
  }
);


const completeBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId } = req.params;
    const providerId = req.user.id; 

    try {
      const booking = await BookingServices.completeOrCancelBookingFromDB(
        bookingId,
        providerId,
        'completed' 
      );
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Booking completed successfully.',
        data: booking,
      });
    } catch (error) {
      next(error); 
    }
  }
);

// Cancel booking
const cancelBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId } = req.params;
    const providerId = req.user.id; 

    try {
      const booking = await BookingServices.completeOrCancelBookingFromDB(
        bookingId,
        providerId,
        'canceled' 
      );
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Booking canceled successfully.',
        data: booking,
      });
    } catch (error) {
      next(error); // Pass error to the global error handler
    }
  }
);



export const BookingController = {
  createBooking,
  getBookingsByUser,
  getSingleBooking,
  getBookingsByService,
  acceptBooking,
  rejectBooking,
  completeBooking,
  cancelBooking,
};
