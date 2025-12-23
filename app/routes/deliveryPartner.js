import express from "express"
import authMiddleware from "../middleware/authMiddleware.js";
import { addDeliveryPartner,getAllDeliveryPartners,updateDeliveryPartner,deleteDeliveryPartner } from "../controller/deliveryPartner.js";

const router = express.Router()

router.post("/adddeliverypartner",authMiddleware,addDeliveryPartner);
router.get("/getalldeliverypartner",authMiddleware,getAllDeliveryPartners)
router.patch("/updatedeliverypartner/:id",authMiddleware,updateDeliveryPartner);
router.delete("/deletedeliverypartner/:id",authMiddleware,deleteDeliveryPartner);




export default router;