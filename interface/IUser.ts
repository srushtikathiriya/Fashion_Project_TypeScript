import { ObjectId } from "mongoose";

export interface IUser {
  _id?: ObjectId
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  profileImage?: string;
  age?: Number;
  mobileNo?: string;
  isDelete?: boolean;
}