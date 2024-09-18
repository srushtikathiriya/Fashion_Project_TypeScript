import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../model/user.model";
import { IUser } from "../interface/IUser";
import { ObjectId } from "mongoose";

// Global Variable
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let authorization = req.headers["authorization"];
    if (!authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    let token: string = authorization.split(" ")[1];
    let decodedToken: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decodedToken || !decodedToken.userId) {
      return res.json({ message: "Invalid token" });
    }
    let user = await User.findById(decodedToken.userId as ObjectId);
    if (!user) {
      return res.json({ message: "User not found" });
    }

    req.user = user as IUser;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};