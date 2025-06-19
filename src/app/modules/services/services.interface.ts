import { Model, Types } from 'mongoose';

export type IService = {
  name: string;
  description?: string;
  price: number;
  category: Types.ObjectId;
  provider: Types.ObjectId;
  image: string;
  tags?: string[];
  isActive?: boolean;
  rating?: number;
  isTrending?: boolean;
  isRecommended?: boolean;
};

export type IPortfolio = {
  provider: Types.ObjectId;
  name: string;
  image: string;
  thumbnails: string[];
  description: string;
};

export type ServiceModel = Model<IService>;
export type Portfoli0Model = Model<IPortfolio>;
