
import mongoose from "mongoose";



const categorySchema = new mongoose.Schema({
    name:{type:String,required:true,unique:true},
    description:{type:String},
    store:{type:mongoose.Schema.Types.ObjectId,ref:"Store",required:true},



},{timestamps:true}
)
 export default mongoose.model("Category",categorySchema)