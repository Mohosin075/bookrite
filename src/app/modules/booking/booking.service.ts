import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Service } from '../services/services.model';
import Booking from './booking.model';
import { IBooking } from './booking.interface';

// Create a booking
const createBookingFromDB = async (
  serviceId: string,
  userId: string,
  date: string,
  startTime: string
) => {
  const service = await Service.findById(serviceId);

  if (!service) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Service not found!');
  }

  // Ensure availability array exists
  if (!service.availability) {
    service.availability = [];
  }

  // Check if the date exists in availability
  const availabilityIndex = service.availability.findIndex(
    avail => avail.date === date
  );

  if (availabilityIndex === -1) {
    // If date not found, push a new date with this time slot
    service.availability.push({
      date,
      startTimes: [
        {
          start: startTime,
          isBooked: true,
          status: 'accepted',
        },
      ],
    });
  } else {
    const availabilityForDate = service.availability[availabilityIndex];

    if (!availabilityForDate) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Availability data is corrupted.'
      );
    }

    const existingTime = availabilityForDate.startTimes.find(
      time => time.start === startTime
    );

    if (existingTime) {
      if (existingTime.isBooked) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'Time slot already booked!'
        );
      }

      existingTime.isBooked = true;
      existingTime.status = 'accepted';
    } else {
      // Add the new startTime to that date
      availabilityForDate.startTimes.push({
        start: startTime,
        isBooked: true,
        status: 'accepted',
      });
    }
  }

  // Save updated service availability
  await service.save();

  // Create the booking
  const booking = new Booking({
    service: serviceId,
    user: userId,
    date,
    startTime,
    status: 'pending',
    paymentStatus: 'unpaid',
  });

  await booking.save();

  return booking;
};

// Get all bookings for a user
const getBookingsByUserFromDB = async (userId: string) => {
  const bookings = await Booking.find({ user: userId })
    .populate({
      path: 'service',
      select: 'name description price category rating image',
    })
    .populate({
      path: 'user',
      select: 'name address image',
    });
  if (bookings.length === 0) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'No bookings found for this user!'
    );
  }

  return bookings;
};

// Get a single booking by ID
const getSingleBookingFromDB = async (id: string) => {
  const booking = await Booking.findById(id)
    .populate({
      path: 'service',
      select: 'name description price category rating image',
    })
    .populate({
      path: 'user',
      select: 'name address image',
    });
  if (!booking) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Booking not found!');
  }

  return booking;
};

type ProviderStatus = Extract<IBooking['status'], 'accepted' | 'rejected'>;


// TODO
const updateBookingStatusFromDB = async (
  bookingId: string,
  status: ProviderStatus,
  providerId: string // 🔐 Passed from auth middleware
) => {
  if (status !== 'accepted' && status !== 'rejected') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid status for provider!');
  }
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Booking not found!');
  }

  const service = await Service.findById(booking.service);
  if (!service) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Associated service not found!');
  }

  if (String(service.provider) !== String(providerId)) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only the provider can update this booking!'
    );
  }

  // Update booking status
  booking.status = status;

  // Update time slot status
  const availability = service.availability?.find(
    item => item.date === booking.date
  );
  const timeSlot = availability?.startTimes.find(
    slot => slot.start === booking.startTime
  );

  if (timeSlot) {
    timeSlot.status = status;
    if (status === 'rejected') {
      timeSlot.isBooked = false;
    }
    await service.save();
  }

  await booking.save();

  return booking;
};

// TODO
const cancelBookingFromDB = async (
  bookingId: string,
  userId: string // 🔐 Passed from auth middleware
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Booking not found!');
  }

  if (String(booking.user) !== String(userId)) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only the user can cancel this booking!'
    );
  }

  booking.status = 'cancelled';

  const service = await Service.findById(booking.service);
  if (!service) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Associated service not found!');
  }

  const availability = service.availability?.find(
    item => item.date === booking.date
  );
  const timeSlot = availability?.startTimes.find(
    slot => slot.start === booking.startTime
  );

  if (timeSlot) {
    timeSlot.isBooked = false;
    timeSlot.status = 'pending';
    await service.save();
  }

  await booking.save();

  return booking;
};

// Get all bookings for a service
const getBookingsByServiceFromDB = async (serviceId: string) => {
  const bookings = await Booking.find({ service: serviceId }).populate('user');
  if (bookings.length === 0) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'No bookings found for this service!'
    );
  }

  return bookings;
};

export const BookingServices = {
  createBookingFromDB,
  getBookingsByUserFromDB,
  getSingleBookingFromDB,
  updateBookingStatusFromDB,
  cancelBookingFromDB,
  getBookingsByServiceFromDB,
};
