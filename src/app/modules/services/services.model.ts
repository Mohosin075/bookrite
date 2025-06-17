import { model, Schema } from 'mongoose';
import { IService, ServiceModel } from './services.interface';

const serviceSchema = new Schema<IService, ServiceModel>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    provider: { type: Schema.Types.ObjectId, ref: 'User' },
    image: { type: String, required : true },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isTrending : { type: Boolean, default: false },
    isRecommended : { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Service = model<IService, ServiceModel>('Service', serviceSchema);
