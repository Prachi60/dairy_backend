import  express from "express"
import { createProduct ,getAllProducts,getProductById,updateProductById,deleteProductById,getProductByCategoryId} from "../controller/product.js"
import authMiddleware from "../middleware/authMiddleware.js";
import { upload, uploadMultiple } from "../middleware/fileUpload.js";
import { generateFileUrl } from "../middleware/fileUpload.js";




const router = express.Router()
router.post("/registerproduct",authMiddleware,uploadMultiple,generateFileUrl,createProduct);
// router.get("/getproduct",authMiddleware,getProduct);
router.get("/product",getAllProducts);
router.get("/product/:id",getProductById);
router.patch("/update/:id",authMiddleware,uploadMultiple,generateFileUrl,updateProductById);
router.delete("/delete/:id",authMiddleware,deleteProductById);
router.get("/getproduct/:categoryId",getProductByCategoryId)

export default router;