import handleResponse from "../utils/helper.js";
import Product from "../models/product.js";
import { createProductValidator } from "../validations/product.js";
import Store from "../models/store.js";
import mongoose from "mongoose";


export const createProduct = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return handleResponse(res, 400, "only admin can proceed further");
    }

    const { error, value } = createProductValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return handleResponse(res, 400, "Validation error", {
        details: error.details.map((err) => err.message),
      });
    }

    const {
      name,
      category,
      price,
      unit,
      description,
      in_stock,
      subscription_available,
      subscription_frequency,
      expire_date,
      max_order_limit,
    } = value;

    const admin_id = req.id;

    const store = await Store.findOne({ admin_id: admin_id });

    if (!store) {
      return handleResponse(res, 400, "Admin doesn't own a store");
    }
    const fileUrls = req.fileUrls||[];

    // console.log(req.fileUrl);
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return handleResponse(res, 400, "product already registered");
    }

    const newProduct = await Product.create({
      name,
      category: category,
      price,
      unit,
      description,
      store: store._id.toString(),
      in_stock,
      image: fileUrls,
      subscription_available,
      subscription_frequency,
      expire_date,
      max_order_limit,
    });

    return handleResponse(
      res,
      201,
      "Product registered successfully",
      newProduct
    );
  } catch (error) {
    console.error("Error in registering the product", error.message);
    return handleResponse(res, 500, "internal server error", {
      error: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { category, store, search, priceRange } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    if (store && store !== "all") {
      filter.store = store;
    }

    if (priceRange) {
      const ranges = priceRange.split(",");

      const conditions = ranges.map((range) => {
        const [min, max] = range.split("-");
        return {
          price: { $gte: Number(min), $lte: Number(max) },
        };
      });

      filter.$or = conditions;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("store", "store_name")
      .skip(skip)
      .limit(limit);
      // const productCount=products.length;
      // console.log("productcount===",productCount);
      

    return handleResponse(res, 200, "Products fetched successfully", {
      products,
      skip,
      
      limit,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return handleResponse(res, 500, "Internal server error", {
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("store", "store_name");

    if (!product) {
      return handleResponse(res, 404, "Product not found");
    }

    return handleResponse(res, 200, "Product fetched successfully", product);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    return handleResponse(res, 500, "Internal server error", {
      error: error.message,
    });
  }
};

export const updateProductById = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return handleResponse(res, 400, "only admin can proceed further");
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return handleResponse(res, 400, "Invalid product ID");
    }

    const {
      name,
      category,
      price,
      unit,
      description,
      in_stock,
      subscription_available,
      subscription_frequency,
      expire_date,
      max_order_limit,
    } = req.body;

    const newImages = req.fileUrls || [];
    const product = await Product.findById(id);
    if (!product) {
      return handleResponse(res, 404, "Product not found");
    }
     const updatedImages =
      newImages.length > 0 ? [...product.image, ...newImages] : product.image;


    const updateProductInfo = {
      ...(name && { name }),
      ...(category && { category }),
      ...(price && { price }),
      ...(unit && { unit }),
      ...(description && { description }),
     ...(in_stock !== undefined && { in_stock }),
    ...(subscription_available !== undefined && { subscription_available }),

      // ...(subscription_available && { subscription_available }),
      ...(subscription_frequency && { subscription_frequency }),
      ...(expire_date && { expire_date }),
      ...(max_order_limit && { max_order_limit }),
      image:updatedImages
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateProductInfo,
      {
        new: true,
        runValidators: true,
      }
    );

    return handleResponse(
      res,
      200,
      "product updated successfully",
      updatedProduct
    );
  } catch (error) {
    console.error("error in updating the products ", error.message);
    return handleResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return handleResponse(res, 409, "Only  admin can proceed further ");
    }
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return handleResponse(res, 400, "ID not found");
    }

    const deleteProduct = await Product.findByIdAndDelete(id);
    if (!deleteProduct) {
      return handleResponse(res, 404, "product not found");
    }
    return handleResponse(
      res,
      200,
      "product deleted successfully",
      deleteProduct
    );
  } catch (error) {
    console.error("error in deleting the product", error.message);
    return handleResponse(res, 500, "internal server error", {
      error: error.message,
    });
  }
};

export const getProductByCategoryId=async(req,res)=>{
  try{
    const {categoryId} = req.params;

    const product = await Product.find({category:categoryId})
    .populate("category" ,"name description")

    if(!product)
    {
      return handleResponse(res,404,"product not found")
    }

     return handleResponse (res,200,"product fetched successfully",product)
  }
  catch(error)
  {
    console.log("Error in fetching product by category",error.message);
    return handleResponse (res,500,"Internal Server Error",{error:error.message})
  }
} 