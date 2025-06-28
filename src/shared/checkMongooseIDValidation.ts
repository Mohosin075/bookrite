import mongoose from "mongoose"
import { StatusCodes } from "http-status-codes"
import ApiError from "../errors/ApiError";

export const checkMongooseIDValidation = (id: string, name?: string): void => {
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, `Invalid ${name} Object ID`);
    }
    return;
};