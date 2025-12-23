import mongoose from "mongoose";
import Cart from "../models/cart.js";
import handleResponse from "../utils/helper.js";
import { createCartValidator } from "../validations/cart.js";
import { getDurationDays,getDeliveryCount,getDiscountPercent } from "../utils/cartTotalSummary.js";

export const addToCart = async (req, res) => {
  try {
    const { error, value } = createCartValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return handleResponse(res, 400, "Validation error", {
        details: error.details.map((err) => err.message),
      });
    }

    const { product } = value;
    // console.log("prooductid", product);

    const userId = req.id;

    const existingCartItem = await Cart.findOne({ userId, product: product });
    if (existingCartItem) {
      // existingCartItem.quantity += 1;
      // console.log(existingCartItem);

      await existingCartItem.save();
      return handleResponse(
        res,
        409,
        "Product already exists",
        existingCartItem
      );
    }

    if (!existingCartItem) {
      const cart = await Cart.create({
        userId,
        product,
      });
      // console.log("cart===", cart);

      return handleResponse(
        res,
        200,
        "Product Added successfully",
        cart
      );
    }

    return handleResponse(
      res,
      200,
      "product added successfully",
      existingCartItem
    );
  } catch (error) {
    console.error("Error in Adding the item to the cart", error.message);
    console.log(res, 500, "internal Server Error", { error: error.message });
  }
};

export const getCartItems = async (req, res) => {
  try {
    5;
    const cart = await Cart.find({ userId: req.id }).populate("product");
    const cartcount = cart.length;
    // console.log("cart Items:", cart);

     const totalAmount = cart.reduce((sum, item) => {
      const price = item.product?.price || 0;
      const quantity = item.quantity || 1;
      return sum + price * quantity;
    }, 0);

    return handleResponse(res, 200, "Products Fetched Successfully", {
      cart,
      cartcount,
      totalAmount
    });
  } catch (error) {
    console.error("Error in fetching the cart items", error.message);
    console.log(res, 500, "Internal Server Error", { error: error.message });
  }
};

export const updateCartItems = async (req, res) => {
  try {
    const { quantity } = req.body;
    // console.log("Qunjdjc:", quantity);

    const { cartId } = req.params;
    const userId = req.id;
    
    if (quantity === undefined) {
      return handleResponse(res, 400, "Quantity is required");
    }

    // console.log("userId============", userId);

    if (quantity < 0) {
      return handleResponse(res, 400, "Quantity cannot be in negative");
    }
    const cartItem = await Cart.findOne({ _id: cartId, userId: userId });
    if (!cartItem) {
      return handleResponse(res, 404, "cart Item not found");
    }
    if (quantity === 0) {
      await Cart.findByIdAndDelete(cartId);
       const allItems = await Cart.find({ userId });

      return handleResponse(res, 200, "Item removed from the cart",allItems);
    }
    cartItem.quantity = quantity;
    await cartItem.save();
   const allItems = await Cart.find({ userId }).populate("product");

    return handleResponse(res, 200, "cart updated successfully", allItems);
  } catch (error) {
    console.error("Error in Updating Cart", error.message);
    return handleResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};



export const deleteCartItems = async (req, res) => {
  try {
    const { id: productId } = req.params; 
    const userId = req.id;

    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return handleResponse(res, 400, "Invalid product ID");
    }

    const deletedItem = await Cart.findOneAndDelete({
      userId,
      product: productId,
    });
    

    if (!deletedItem) {
      return handleResponse(res, 404, "Product not found in your cart");
    }

    return handleResponse(
      res,
      200,
      "Product removed from cart successfully",
      deletedItem
    );
  } catch (error) {
    console.error("Error deleting cart item:", error.message);
    return handleResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};


export const getCartByProductId= async(req,res)=>{
  try{
    const {productId}=req.params;
    const userId=req.id;
    const product = await Cart.find({product:productId,userId:userId}).populate("product")
    if(!product||product.length===0)
    {
      return handleResponse(res,404,"product not found in cart")
    }
   return handleResponse (res,200,"product fetched succcessfully",product);

  }
  catch(error)
  {
    console.error("Errror in fetching product by cart",error.message);
    return handleResponse(res,500,"Internal Server Error",{error:error.message})
  }
}


export const getTotal = async (req, res) => {
  try {
    const { cartItemIds, SubscriptionType, duration } = req.body;

    if (!cartItemIds?.length) {
      return handleResponse(res, 400, "Cart items required");
    }

    const cartItems = await Cart.find({
      _id: { $in: cartItemIds },
      userId: req.id,
    }).populate("product");

    if (!cartItems.length) {
      return handleResponse(res, 404, "Cart empty");
    }

    const days = getDurationDays(duration);
    const deliveries = getDeliveryCount(SubscriptionType, days);
    const discountPercent = getDiscountPercent(SubscriptionType);
    const platformFee = 20;

    let subTotal = 0;

    const itemSummary = cartItems.map((item) => {
      const itemTotal =
        item.product.price * item.quantity * deliveries;

      subTotal += itemTotal;

      return {
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        deliveries,
        total: itemTotal,
      };
    });

    const discountAmount = (subTotal * discountPercent) / 100;
    const finalAmount = subTotal - discountAmount + platformFee;

    return handleResponse(res, 200, "Total calculated successfully", {
      subscriptionType: SubscriptionType,
      duration,
      deliveries,
      subTotal,
      discountPercent,
      discountAmount,
      platformFee,
      finalAmount,
      items: itemSummary,
    });
  } catch (error) {
    console.error("error in getting total", error.message);
    return handleResponse(res, 500, "internal server error", {
      error: error.message,
    });
  }
}; 