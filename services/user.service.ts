import { ObjectId } from "mongoose";
import User from "../model/user.model";
import { IUser } from "../interface/IUser";

export default class UserServices {
  // Add New User
  async addNewUser(body: object) {
    try {
      let user: IUser = await User.create(body);
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  }


  async findOneUser(body: object) {
    try {
      let user: IUser | null= await User.findOne(body);
      return user;
      if (user === null) {
        throw new Error('User not found');
      }
    }
    catch (error) {
      console.log(error);
      return error;
    }
  }

  // get single User
  async getUser(body: object) {
    try {
      let user = await User.findOne(body);
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getAllUser(body: object) {
    try {
      let user = await User.find(body);
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // update User by id
  async updateUser(id: ObjectId, body: object) {
    try {
      return await User.findByIdAndUpdate(id, { $set: body }, { new: true });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getUserById(id: ObjectId) {
    try {
      return await User.findById(id);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async delete(userId:ObjectId, body:object){
    return await User.findByIdAndUpdate(userId,body,{new: true});
}
}