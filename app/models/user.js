import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact_number: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: Number, required: true },
    role: { type: String, enum: ["superadmin", "admin", "customer"] },
    // store:{type:mongoose.Schema.Types.ObjectId,ref:"Store",required:function(){
    //     return this.role ==="admin"
    // }},
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: false,
    },

    password: { type: String, required: true },
    token: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
