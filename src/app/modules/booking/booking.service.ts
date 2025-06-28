import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Service } from '../services/services.model';
import Booking from './booking.model';


const createBookingFromDB = async (
  serviceId: string,
  userId: string,
  date: Date,
  startTime: string,
) => {
  const service = await Service.findById(serviceId);

  if (!service) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Service not found!');
  }

  // Ensure availability array exists
  if (!service.availability) {
    service.availability = [];
  }

  // Convert input date to date-only string for comparison
  const inputDateStr = new Date(date).toISOString().slice(0, 10);

  // Find availability index by date (compare by date string)
  const availabilityIndex = service.availability.findIndex(avail => {
    const availDateStr = new Date(avail.date).toISOString().slice(0, 10);
    return availDateStr === inputDateStr;
  });

  if (availabilityIndex === -1) {
    // If date not found, add a new availability entry
    service.availability.push({
      date,
      startTimes: [
        {
          start: startTime,
          isBooked: true,
          status: 'pending',
        },
      ],
    });
  } else {
    const availabilityForDate = service.availability[availabilityIndex];

    if (!availabilityForDate) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Availability data is corrupted.',
      );
    }

    const existingTime = availabilityForDate.startTimes.find(
      time => time.start === startTime,
    );

    if (existingTime) {
      if (existingTime.isBooked) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'Time slot already booked!',
        );
      }

      existingTime.isBooked = true;
      existingTime.status = 'pending';
    } else {
      availabilityForDate.startTimes.push({
        start: startTime,
        isBooked: true,
        status: 'pending',
      });
    }
  }

  // Save updated service availability
  await service.save();

  // Create the booking
  const booking = await Booking.create({
    service: serviceId,
    user: userId,
    date,
    startTime,
    status: 'pending',
    paymentStatus: 'unpaid',
  });


  return booking;
};

// Get all bookings for a user
const getBookingsByUserFromDB = async (userId: string, status: string) => {
  const bookings = await Booking.find({ user: userId, status })
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
      'No bookings found for this user!',
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

// Get all bookings for a service
const getBookingsByServiceFromDB = async (serviceId: string) => {
  const bookings = await Booking.find({ service: serviceId }).populate('user');
  if (bookings.length === 0) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'No bookings found for this service!',
    );
  }

  return bookings;
};

const acceptBookingFromDB = async (bookingId: string, providerId: string) => {
  const booking = await Booking.findById(bookingId)
    .populate('service') // Populates the service field with the full Service document
    .populate('service.provider') // Optionally populate the provider (User) field inside service
    .exec();

  if (!booking) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Booking not found or unauthorized.',
    );
  }

  if (booking.status === 'accepted' || booking.status === 'canceled') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Booking is already processed.',
    );
  }

  // // Ensure the provider is the correct one
  // if (booking.service.provider._id.toString() !== providerId) {
  //   throw new ApiError(
  //     StatusCodes.FORBIDDEN,
  //     'You are not authorized to accept this booking.'
  //   );
  // }

  // Update booking status to 'accepted'
  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    { status: 'accepted' },
    { new: true },
  );

  // Update the time slot in the service (mark as booked)
  const serviceDoc = await Service.findById(booking.service._id);
  const availabilityForDate = serviceDoc?.availability?.find(
    a => a.date === booking.date,
  );

  if (!availabilityForDate) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Availability not found for this date!',
    );
  }

  const existingTime = availabilityForDate.startTimes.find(
    t => t.start === booking.startTime,
  );
  if (!existingTime) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Time slot not found!');
  }

  // Mark the time slot as booked and set status to 'accepted'
  existingTime.isBooked = true;
  existingTime.status = 'accepted';

  // Save the updated service availability (with the new availability slot marked as booked)
  await serviceDoc?.save();

  return updatedBooking;
};

const rejectBookingFromDB = async (bookingId: string, providerId: string) => {
  const booking = await Booking.findById(bookingId)
    .populate('service')
    .populate('service.provider')
    .exec();

  if (!booking) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Booking not found or unauthorized.',
    );
  }

  if (booking.status === 'rejected' || booking.status === 'canceled') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Booking is already rejected or canceled.',
    );
  }

  // Update booking status to 'rejected'
  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    { status: 'rejected' },
    { new: true },
  );

  // Update the time slot in the service (mark as not booked)
  const serviceDoc = await Service.findById(booking.service._id);
  const availabilityForDate = serviceDoc?.availability?.find(
    a => a.date === booking.date,
  );

  if (!availabilityForDate) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Availability not found for this date!',
    );
  }

  const existingTime = availabilityForDate.startTimes.find(
    t => t.start === booking.startTime,
  );
  if (!existingTime) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Time slot not found!');
  }

  // Mark the time slot as not booked and set status to 'rejected'
  existingTime.isBooked = false;
  existingTime.status = 'rejected';

  // Save the updated service availability (with the time slot marked as not booked)
  await serviceDoc?.save();

  return updatedBooking;
};

const completeOrCancelBookingFromDB = async (
  bookingId: string,
  providerId: string,
  action: 'completed' | 'canceled',
) => {
  const booking = await Booking.findById(bookingId)
    .populate('service')
    .populate('service.provider')
    .exec();

  if (!booking) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Booking not found or unauthorized.',
    );
  }

  if (booking.status === 'completed' || booking.status === 'canceled') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Booking is already processed.',
    );
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    { status: action === 'completed' ? 'completed' : 'canceled' },
    { new: true },
  );

  const serviceDoc = await Service.findById(booking.service._id);

  if (!serviceDoc) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found.');
  }

  const availabilityForDate = serviceDoc.availability?.find(
    a => a.date === booking.date,
  );

  if (!availabilityForDate) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Availability not found for this date!',
    );
  }

  const existingTime = availabilityForDate.startTimes.find(
    t => t.start === booking.startTime,
  );

  if (!existingTime) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Time slot not found!');
  }

  existingTime.isBooked = false;
  existingTime.status = 'pending';
  await serviceDoc.save();

  return updatedBooking;
};

export const BookingServices = {
  createBookingFromDB,
  getBookingsByUserFromDB,
  getSingleBookingFromDB,
  getBookingsByServiceFromDB,
  acceptBookingFromDB,
  rejectBookingFromDB,
  completeOrCancelBookingFromDB,
};
