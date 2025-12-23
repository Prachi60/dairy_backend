import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { CreateSubscription } from "../controller/Subscription.js"


const router = express.Router()


router.post("/createsubscription",authMiddleware,CreateSubscription);


export default router;
