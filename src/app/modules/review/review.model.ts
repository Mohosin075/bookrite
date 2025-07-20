import { model, Schema } from 'mongoose';
import { IReview } from './review.interface';

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },

    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: true },
        tip: { type: Number, default: 0 },
  },
  { timestamps: true },
);

reviewSchema.index({ user: 1 });
reviewSchema.index({ service: 1 });

export const Review = model<IReview>('Review', reviewSchema);
