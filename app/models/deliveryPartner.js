
import mongoose from "mongoose";

const deliveryPartnerSchema = new mongoose.Schema({
    name:{type:String,required:true},
    phone:{type:Number,required:true},
    email:{type:String,unique:true},
    availability: {type: Boolean, default: true},
    completedOrders: {type: Number,default: 0},
    status: {type: String,enum: ["Active", "Inactive", "Blocked"],default: "Active"},
},{timestamps:true}
)
export default mongoose.model("DeliveryPartner",deliveryPartnerSchema)