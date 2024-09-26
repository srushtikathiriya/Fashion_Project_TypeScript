import mongoose from "mongoose";
import { IProduct } from "../interface/IProduct";

const productSchema = new mongoose.Schema<IProduct>({
    title: {
        type: String,
        unique: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    productImage: {
        type: String,
    },
    category: [{
        type: String
    }],
    isDelete: {
        type: Boolean,
        default: false
    }
},
{
    versionKey: false,
    timestamps: true
});


export default mongoose.model('products', productSchema);