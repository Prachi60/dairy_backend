import mongoose from "mongoose";
const storeSchema = new mongoose.Schema({

    store_name:{type:String,required:true},
    store_address:{type:String,required:true},
    
    bank_account_number:{type:Number,required:true},
    ifsc_code:{type:String,required:true},
   
    admin_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
}


},{timestamps:true}
)
export default mongoose.model("Store",storeSchema);