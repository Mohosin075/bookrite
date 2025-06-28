import { Model, Types } from 'mongoose';

export type IReview = {
  user: Types.ObjectId;
  service: Types.ObjectId;
  rating: number;
  reviewText: string;
  tip?: number;
}

export type ReviewModel = Model<IReview>;
