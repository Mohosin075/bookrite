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
  isRecommended? : boolean;
};

export type ServiceModel = Model<IService>;
