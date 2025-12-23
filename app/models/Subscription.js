
import mongoose from "mongoose";


 const SubscriptionSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    product:{type:mongoose.Schema.Types.ObjectId,ref:"Product",required:true},
    SubscriptionType:{type:String ,enum:["daily","alternate_days","weekly","monthly"]},
    duration:{type:String,enum:["7days","15days","4days","8days","15days","30days","custom","1week","2week","3week","4week","1month","2month","3month","6month"]},
    startDate:{type:Date,required:true},
    shiftTime:{type:String},
    isActive:{type:Boolean,default:true},
    endDate:{type:Date},
    selectedDays:{type:[String]},
    platformfee:{type:Number,default:0},
    discountpercent:{type:Number,default:0},
    nextDeliveryDate: {
  type: Date,
  required: true,
},

    


},
{timestamps:true}
);
 export default mongoose.model("Subscription",SubscriptionSchema);