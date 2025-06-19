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
  start: { type: String},
  isBooked: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending', 'completed', 'accepted'],
    default: 'pending',
  },
});

const availabilitySchema = new Schema<IAvailability>({
  date: { type: String},
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
    image: { type: String, required: true },
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    isTrending: { type: Boolean, default: false },
    isRecommended: { type: Boolean, default: false },
    rating: { type: String, default: '0' },
    availability: {
      type: [availabilitySchema],
      default: [],
    },
  },
  { timestamps: true }
);

const portfolioSchema = new Schema<IPortfolio, Portfoli0Model>(
  {
    provider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const Portfolio = model<IPortfolio, Portfoli0Model>(
  'Portfolio',
  portfolioSchema
);

export const Service = model<IService, ServiceModel>('Service', serviceSchema);
