import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    totalAmount: { type: Number, required: true },
    address: { type: String },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
     default: null
    },

    // subscriptionType: { type: String },
    subscription_frequency: { type: String },
    paymentMode: { type: String, enum: ["online", "cod"] },
    orderStatus: { type: String, default: "placed" },
    paymentStatus: { type: String, enum: ["paid", "pending", "fail"] },
    Razorpay_id: { type: String },
    amount: { type: String },
    amount_paid: { type: String },
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPartner",
    },
    deliveryAssigned: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "assigned", "out of delivery", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);
export default mongoose.model("Order", orderSchema);
