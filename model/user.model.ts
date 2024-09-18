import mongoose, { mongo } from "mongoose";
import { IUser } from "../interface/IUser";

const userSchema = new mongoose.Schema<IUser>({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String
    },
    profileImage: {
        type: String
    },
    mobileNo: {
        type: String
    },
    age: {
        type: Number
    },
    isDelete: {
        type: Boolean,
        default: false
    }
},
{
    versionKey: false,
    timestamps: true
});

export default mongoose.model('users', userSchema);