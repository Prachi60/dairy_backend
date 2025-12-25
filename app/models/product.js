
import mongoose from "mongoose";

const productSchema =new mongoose.Schema({
    name:{type:String,required:true},
    category:{type:mongoose.Schema.Types.ObjectId,ref:"Category",required:true},
    price:{type:Number,required:true},
    unit:{type:String},
    description:{type:String},
    // store:{type:mongoose.Schema.Types.ObjectId,ref:"Store",required:true},
    store:{type:String},
    in_stock:{type:Boolean,required:true},
    subscription_available:{type:Boolean},
    expire_date:{type:String,required:true},
    // subscription_frequency:{type:String,enum:["daily","alternate_day","weekend_only","weekly"],default:"daily"},
    image:{type:[String]},
    // max_order_limit:{type:Number,default:5}

},
{timestamps:true}
)

export default mongoose.model("Product",productSchema);