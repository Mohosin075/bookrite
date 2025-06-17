import { Model } from 'mongoose';

export type ICategory = {
  name: string;
  image?: string;
};

export type CategoryModel = Model<ICategory>;
