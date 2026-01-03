import express from "express"
import { createOrder,verifyPayment} from "../controller/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/createOrder",authMiddleware,createOrder);
router.post("/verify-payment",verifyPayment);


export default router;