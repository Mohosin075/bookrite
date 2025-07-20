import { model, Schema } from 'mongoose';
import { bannerModel, IBanner } from './banner.interface';

const bannerSchema = new Schema<IBanner, bannerModel>(
  {
    // Note : Only Image field needed for this model (nadir vai)
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: 'https://i.ibb.co/z5YHLV9/profile.png',
    },
  },
  {
    timestamps: true,
  },
);

export const Banner = model<IBanner, bannerModel>('Banner', bannerSchema);
