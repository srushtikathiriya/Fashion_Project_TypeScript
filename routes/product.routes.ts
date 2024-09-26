import express from "express"
import { addNewProduct, deleteProduct, getAllProducts, updateProduct } from "../controller/product.controller";
const productRoutes = express.Router();
const {verifyToken}= require('../helpers/verifyToken')

productRoutes.post("/",verifyToken, addNewProduct);
productRoutes.get("/", getAllProducts);
productRoutes.put("/", updateProduct);
productRoutes.delete("/", deleteProduct);

module.exports = productRoutes