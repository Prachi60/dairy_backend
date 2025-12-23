import express from "express"
import { createOrder,verifyPayment} from "../controller/paymentController.js";

const router = express.Router();

router.post("/createOrder",createOrder);
router.post("/verify-payment",verifyPayment);


export default router;