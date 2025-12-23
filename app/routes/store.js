import express from "express"
import { registerStore,getAllStore } from "../controller/store.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router= express.Router();
router.post("/registerStore",authMiddleware,registerStore);
router.get("/get",getAllStore);


export default router;