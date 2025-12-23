import handleResponse from "../utils/helper.js";
import User from "../models/user.js";
import Product from "../models/product.js";
import WishList from "../models/wishlist.js";
import { createWishlistValidator } from "../validations/wishlist.js";
import wishlist from "../models/wishlist.js";

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.id;
    console.log("userid=====", userId);

    const { error } = createWishlistValidator.validate(req.body);
    if (error) {
      return handleResponse(res, 400, "Validation error", {
        details: error.details.map((err) => err.message),
      });
    }
    const item = await WishList.create({
      productId,
      userId,
    });

    return handleResponse(res, 200, "Product Added to wishlist", item);
  } catch (error) {
    console.error("Error in  adding product to wishlist", error.message);
    return handleResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

export const getWishlistItem = async (req, res) => {
  try {
    const userId = req.id;

    const items = await WishList.find({ userId }).populate({
      path: "productId",
      model: "Product",
    });

    return handleResponse(res, 200, "Wishlist fetched successfully", items);
  } catch (error) {
    console.error("Error in fetching wishlist item:", error.message);
    return handleResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

// export const getWishlistItem = async(req,res)=>{
//     try{
//         const item = await wishlist.find({userId:req.id,}).populate("product")
//         return handleResponse (res,200,"wishlist fetched successfully",item)
//     }
//     catch(error)
//     {
//         console.error("Error in fetching wishlist item",error.message);
//         return handleResponse(res,500,"Internal Server Error",{error:error.message})
//     }
// }
export const removefromWishlist = async (req, res) => {
  try {
    const { id } = req.params;   
    const userId = req.id;

    console.log("productId:", id);

    const deletedItem = await wishlist.findOneAndDelete({
      userId: userId,
      productId: id
    });

    if (!deletedItem) {
      return handleResponse(res, 404, "Item not found in wishlist");
    }

    return handleResponse(res, 200, "Product removed from wishlist", deletedItem);
  } catch (error) {
    console.error("Error in removing from wishlist", error.message);
    return handleResponse(res, 500, "Internal server error", {
      error: error.message,
    });
  }
};
