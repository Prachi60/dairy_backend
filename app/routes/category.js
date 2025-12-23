import express from "express";
import { registerCategory,getAllCategory ,updateCategoryById,deleteCategoryById,getCategoriesByStoreId} from "../../app/controller/category.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/registercategory", authMiddleware, registerCategory);
router.get("/getAllCategory",getAllCategory);

router.patch("/updatecategory/:id",authMiddleware,updateCategoryById);
router.delete("/deletecategory/:id",authMiddleware,deleteCategoryById);
router.get("/category/store/:storeId",getCategoriesByStoreId);



export default router;
