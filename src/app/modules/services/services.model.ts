import { model, Schema, Types } from 'mongoose';
import {
  IAvailability,
  IPortfolio,
  IService,
  IStartTime,
  Portfoli0Model,
  ServiceModel,
} from './services.interface';

const startTimeSchema = new Schema<IStartTime>({
  start: { type: String },
  isBooked: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending', 'completed', 'accepted', 'rejected', 'cancaled'],
    default: 'pending',
  },
});

const availabilitySchema = new Schema<IAvailability>({
  date: { type: Date },
  startTimes: {
    type: [startTimeSchema],
    default: [],
  },
});

const serviceSchema = new Schema<IService, ServiceModel>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    provider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String, required: false },
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    isTrending: { type: Boolean, default: false },
    isRecommended: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    review: { type: Schema.Types.ObjectId, ref: 'Review' },
    reviewsCount: { type: Number, default: 0 },
    availability: {
      type: [availabilitySchema],
      default: [],
    },
  },
  { timestamps: true },
);

const portfolioSchema = new Schema<IPortfolio, Portfoli0Model>(
  {
    provider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

portfolioSchema.index({ provider: 1 });

export const Portfolio = model<IPortfolio, Portfoli0Model>(
  'Portfolio',
  portfolioSchema,
);

serviceSchema.index({ category: 1 });
serviceSchema.index({ provider: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ isTrending: 1 });
serviceSchema.index({ isRecommended: 1 });

export const Service = model<IService, ServiceModel>('Service', serviceSchema);
