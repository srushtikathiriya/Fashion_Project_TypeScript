import Product from "../model/product.model";
import { IProduct } from "../interface/IProduct";
import mongoose, { ObjectId } from "mongoose";

export default class ProductServices {
  // Add New Product
  async addNewProduct(body: object) {
    try {
      return await Product.create(body);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // Get Product
  async getProduct(body: object) {
    try {
      return await Product.findOne(body);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // Get Product by ID
  async getProductById(id: ObjectId) {
    try {
      return await Product.findById(id);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // update product
  async updateProduct(id: ObjectId, body: object) {
    try {
      return await Product.findByIdAndUpdate(id, { $set: body }, { new: true });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // Get All Products
  async getAllProducts(query: any) {
    try {
      // Pagination
      let pageNo: number = Number(query.pageNo || 1);
      let perPage: number = Number(query.perPage || 10);
      let skip: number = (pageNo - 1) * perPage;

      // Search with keyword
      let search =
        query.search && query.search !== ""
          ? [
              {
                $match: {
                  $or: [
                    {
                      title: {
                        $regex: query.search.trim().replace(/\s+/g, " "),
                        $options: "i",
                      },
                    },
                    {
                      description: {
                        $regex: query.search.trim().replace(/\s+/g, " "),
                        $options: "i",
                      },
                    },
                    {
                      category: {
                        $regex: query.search.trim().replace(/\s+/g, " "),
                        $options: "i",
                      },
                    },
                  ],
                },
              },
            ]
          : [];

      // category wise listing
      let categoryWise =
        query.category && query.category !== ""
          ? [
              {
                $match: {
                  category: {
                    $regex: query.category.trim().replace(/\s+/g, " "),
                    $options: "i",
                  },
                },
              },
            ]
          : [];
          
      // Product by id
      let productById =
        query.productId && query.productId !== ""
          ? [
              {
                $match: {
                  _id: new mongoose.Types.ObjectId(query.productId),
                },
              },
            ]
          : [];

      let find = [
        { $match: { isDelete: false } },
        ...categoryWise,
        ...search,
        ...productById,
        {
          $skip: skip,
        },
        {
          $limit: perPage,
        },
      ];

      let results: IProduct[] = await Product.aggregate(find);
      let totalPages: number = Math.ceil(results.length / perPage);

      return {
        totalCounts: results.length,
        totalPages: totalPages,
        currentPage: pageNo,
        result: results,
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}