import { model, Schema } from 'mongoose';
import { CategoryModel, ICategory } from './categories.interface';

const categorySchema = new Schema<ICategory, CategoryModel>(
  {
    name: {
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

export const Category = model<ICategory, CategoryModel>(
  'Category',
  categorySchema,
);
