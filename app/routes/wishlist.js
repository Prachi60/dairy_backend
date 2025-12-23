import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { addToWishlist ,getWishlistItem,removefromWishlist} from "../controller/wishlist.js"

const router = express.Router();


router.post("/addtowishlist",authMiddleware,addToWishlist);
router.get("/getwishlistitem",authMiddleware,getWishlistItem);
router.delete("/removefromwishlist/:id",authMiddleware,removefromWishlist);




export default router;