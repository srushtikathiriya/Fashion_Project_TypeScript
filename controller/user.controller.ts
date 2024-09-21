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

exports.registerUser = async (req: Request, res: Response) => {
  try {
      let imagePath = ''
      let user = (await userService.findOneUser({ email: req.body.email, isDelete: false })) as IUser;
      if (user) {
          return res.status(400).json({ message: "User Alrady Exists..." });
      }

      if (req.file) {
          imagePath = req.file.path.replace(/\/g/, "/");
      }

      let hashPassword = await bcrypt.hash(req.body.password, 10);
      console.log(hashPassword);

       user = (await userService.addNewUser({ ...req.body, password: hashPassword, profileImage: imagePath })) as IUser;
      res.status(201).json({ user, message: "User Registration Successfully" });

  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error.." })
  }
}



exports.loginUser = async (req: Request, res: Response) => {
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




exports.getProfile = async (req: Request, res: Response) => {
  try {
    let user = await userService.getAllUser({isDelete:false}) as IUser;
    if (!user) {
      return res.json({ message: "user not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal Server error." });
  }
};


exports.updateProfile = async (req: Request, res: Response) => {
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

exports.changePassword = async (req: Request, res: Response) => {
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

exports.deleteUser = async(req: Request, res: Response) => {
  try {
      // let user = req.user;
     let user = await userService.delete(
          req.user?._id as ObjectId,
          {isDelete:true}
      )as IUser;
      res.status(202).json({user,message:"User Delete Success "})
  } catch (error) {
      console.log(error);
      res.status(500).json({message:"Internal Server Error"});
  }
}