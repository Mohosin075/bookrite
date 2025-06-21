import { Model, Types } from 'mongoose';

export interface IStartTime {
  start: string;
  isBooked: boolean;
  status: 'pending' | 'completed' | 'accepted';
}

export interface IAvailability {
  date: string;
  startTimes: IStartTime[];
}

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
  availability?: IAvailability[];
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
