import { Request, Response } from "express";
import { IUser } from "../interface/IUser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserServices from "../services/user.service";
import { ObjectId } from "mongoose";
const userService = new UserServices();

// Global Variable
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const registerUser = async (req: Request, res: Response) => {
  try {
    let user = (await userService.getUser({
      email: req.body.email,
      isDelete: false,
    })) as IUser;
    if (user) {
      return res.json({ message: "User is already exists" });
    }
    if(req.file){
        req.body.profileImage = req.file.path;
    }
    let hashPassword: string = await bcrypt.hash(req.body.password, 10);
    const newUser = (await userService.addNewUser({
      ...req.body,
      password: hashPassword,
    })) as IUser;
    res.status(201).json({ newUser, message: "New User Registered" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal Server error." });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    let user = (await userService.getUser({
      email: req.body.email,
      isDelete: false,
    })) as IUser;
    if (!user) {
      return res.json({ message: "User is Not Found" });
    }
    let comparePassword: boolean = await bcrypt.compare(
      req.body.password,
      user.password as string
    );
    if (!comparePassword) {
      return res.json({ message: "Password is not matched!!!!" });
    }
    let token: string = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string
    );
    res.status(201).json({ token, message: "Login Success" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal Server error." });
  }
};

const getProfile = async (req: Request, res: Response) => {
  try {
    let user = await userService.getUserById(req.user?._id as ObjectId) as IUser;
    if (!user) {
      return res.json({ message: "user not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal Server error." });
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    let user = (await userService.getUserById(
      req.user?._id as ObjectId
    )) as IUser;
    if (!user) {
      return res.json({ message: "user not found" });
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.json({
        message: "Password or conifirm password not matched!!!",
      });
    }
    let hashPassword: string = await bcrypt.hash(req.body.password, 10);
    await userService.updateUser(user._id as ObjectId, {
      password: hashPassword,
    });
    res.status(200).json({ message: "Changed Password successfully" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal Server error." });
  }
};

const updateProfile = async (req: Request, res: Response) => {
    try {
      let user = (await userService.getUserById(
        req.user?._id as ObjectId
      )) as IUser;
      if (!user) {
        return res.json({ message: "user not found" });
      }
      if(req.file){
        req.body.profileImage = req.file.path;
    }
      let updateUser = await userService.updateUser(user._id as ObjectId, {
        ...req.body
      }) as IUser;
      res.status(200).json({ user: updateUser, message: "Profile Update successfully" });
    } catch (error) {
      console.log(error);
      res.json({ message: "Internal Server error." });
    }
  };

export { registerUser, loginUser, getProfile, changePassword, updateProfile };