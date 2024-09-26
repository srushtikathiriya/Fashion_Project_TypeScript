import { Request, Response } from "express";
import { IProduct } from "../interface/IProduct";
import ProductServices from "../services/product.service";
const productService = new ProductServices();

export const addNewProduct = async (req: Request, res: Response) => {
  try {
    let product = (await productService.getProduct({
      title: req.body.title,
      isDelete: false,
    })) as IProduct;
    if (product) {
      return res.json({ message: "Product is already exist" });
    }
    if (req.file) {
      req.body.productImage = req.file.path;
    }
    let newProduct = (await productService.addNewProduct({
      ...req.body,
    })) as IProduct;
    res
      .status(201)
      .json({ product: newProduct, message: "Product Added Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal Server Error" });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    let products = (await productService.getAllProducts(
      req.query
    )) as IProduct[];
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal Server Error" });
  }
};


export const updateProduct = async (req: Request, res: Response) => {
  try {
    let productId = req.query.productId as any;
    let product = (await productService.getProductById(productId)) as IProduct;
    if (!product) {
      return res.json({ message: "Product is not found...." });
    }
    if (req.file) {
      req.body.productImage = req.file.path;
    }
    product = (await productService.updateProduct(productId, {
      ...req.body,
    })) as IProduct;
    res.status(200).json({ product, message: "Product is Updated..." });
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    let productId = req.query.productId as any;
    let product = (await productService.getProductById(productId)) as IProduct;
    if (!product) {
      return res.json({ message: "Product is not found...." });
    }
    product = (await productService.updateProduct(productId, {
      isDelete: true,
    })) as IProduct;
    res.status(200).json({ message: "Product is Deleted..." });
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal Server Error" });
  }
};