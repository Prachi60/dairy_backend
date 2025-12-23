import express from"express";
import authMiddleware from "../middleware/authMiddleware.js"
import { placeOrder,getAllOrder,getMyOrders,assignDeliveryPartner,getAssigned} from "../controller/order.js";

const router= express.Router();

router.post("/placeorder",authMiddleware,placeOrder);
router.get("/getorders",authMiddleware,getAllOrder);
router.get("/getmyorder",authMiddleware,getMyOrders);
router.post("/assignpartner/:id",authMiddleware,assignDeliveryPartner);
router.get("/getassigned",getAssigned);

export default router;