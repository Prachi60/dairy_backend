import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addToCart,
  getCartItems,
  deleteCartItems,
  updateCartItems,getCartByProductId,
  getTotal
} from "../controller/cart.js";

const router = express.Router();

router.post("/addtocart", authMiddleware, addToCart);
router.post("/get-total", authMiddleware, getTotal);


router.get("/getcartitem", authMiddleware,getCartItems);
router.delete("/deletecartitem/:id",authMiddleware, deleteCartItems);
router.patch("/updatecartitem/:cartId",authMiddleware,updateCartItems);
router.get("/getcart/:productId",authMiddleware,getCartByProductId);

export default router;
