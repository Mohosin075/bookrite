import { Request, Response, NextFunction } from 'express';
import { PaymentService } from './payment.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createStripePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PaymentService.createStripePayment(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Stripe payment initiated successfully',
      data: result,
    });
  }
);

const confirmStripePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { transactionId } = req.params;

    const result = await PaymentService.confirmStripePayment(transactionId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Stripe payment confirmed successfully',
      data: result,
    });
  }
);

export const PaymentController = {
  createStripePayment,
  confirmStripePayment,
};
