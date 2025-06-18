import { model, Schema, Types } from 'mongoose';
import {
  IPortfolio,
  IService,
  Portfoli0Model,
  ServiceModel,
} from './services.interface';

const serviceSchema = new Schema<IService, ServiceModel>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    provider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String, required: true },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isTrending: { type: Boolean, default: false },
    isRecommended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// TODO
const portfolioSchema = new Schema<IPortfolio, Portfoli0Model>(
  {
    provider: { type: Types.ObjectId, ref: 'User', required: true },
    service: { type: Types.ObjectId, ref: 'Service', required: true },
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
