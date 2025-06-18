import { Model } from 'mongoose';

export type IBanner = {
  name: string;
  image: string;
  description : string;
};

export type bannerModel = Model<IBanner>;
