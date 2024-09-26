import { ObjectId } from "mongoose";

export interface IProduct {
  _id?: ObjectId;
  title?: string;
  description?: string;
  price?: number;
  productImage?: string;
  category?: string[];
  isDelete?: boolean;
}