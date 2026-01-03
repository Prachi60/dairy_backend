import { razorpay } from "../config/razorPay.js";
import crypto from "crypto";
import handleResponse from "../utils/helper.js";
import { createPaymentOrderValidator } from "../validations/paymentController.js";
import User from "../models/user.js";
import Order from "../models/order.js";
import Cart from "../models/cart.js";
import OrderItem from "../models/orderItem.js";
import { transporter } from "../utils/emailHandler.js";
import ejs from "ejs";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { fileURLToPath } from "url";

export const createOrder = async (req, res) => {
  try {
    const { error, value } = createPaymentOrderValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return handleResponse(res, 400, "validation error", {
        details: error.details.map((error) => error.message),
      });
    }
const user =req.id;

    const { amount, } = value;

    const options = {
      amount: amount * 100,
      currency: "INR",
    };
    const order = await razorpay.orders.create(options);

    const newOrder = await Order.create({
      user: user,
      totalAmount: order.amount / 100,
      amount_paid: order.amount_paid / 100,
      paymentStatus: "pending",
      Razorpay_id: order.id,
      paymentMode: "online",
    });

    const userId = newOrder.user;
    const Amount = newOrder.totalAmount;
    const amount_paid = newOrder.amount_paid;
    const paymentStatus = newOrder.paymentStatus;
    const paymentMode = newOrder.paymentMode;
    const Razorpay_id = newOrder.Razorpay_id;

    return handleResponse(res, 200, "order created successfully", {
      userId,
      Amount,
      amount_paid,
      paymentStatus,
      paymentMode,
      Razorpay_id,
    });
  } catch (error) {
    console.error("error in creating order", error.message);
    return handleResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};
const renderTemplate = async (templateName, data) => {
  const filePath = path.join(
    __dirname,
    "..",
    "templates",
    templateName
  );

  // console.log("Email template path:", filePath);

  return await ejs.renderFile(filePath, data);
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      address,
      finalAmount,
      subscriptionId,
    } = req.body;
// console.log(" req.body====",req.body);

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return handleResponse(res, 400, "Payment not verified");
    }

    const paidOrder = await Order.findOneAndUpdate(
      { Razorpay_id: razorpay_order_id },
      {
        paymentStatus: "paid",
        orderStatus: "placed",
        address,
        totalAmount: finalAmount,
        subscription: subscriptionId || null,
      },
      { new: true }
    );

    if (!paidOrder) {
      return handleResponse(res, 404, "Razorpay order not found");
    }

    const cartItems = await Cart.find({ userId }).populate("product");
    if (!cartItems.length) {
      return handleResponse(res, 400, "Cart empty");
    }

 

    for (let item of cartItems) {
      await OrderItem.create({
        order: paidOrder._id,
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      });
    }

    await Cart.deleteMany({ userId });

    const orderedItems = await OrderItem.find({
      order: paidOrder._id,
    }).populate("product", "name price");

    const user = await User.findById(userId).select("email name");

    // const productList = orderedItems
    //   .map(
    //     (item) =>
    //       `<li>${item.product.name} × ${item.quantity} — ₹${item.price}</li>`
    //   )
    //   .join("");

    // const mailOptions = {
    //   from: `"no-reply" <${process.env.EMAIL_USER}>`,
    //   to: user.email,
    //   subject: "Order Placed Successfully",
    //   html: `
    //     <h3>Hello ${user.name || "User"}</h3>
    //     <p>Your order has been placed successfully!</p>
    //     <p><strong>Order ID:</strong> ${paidOrder._id}</p>
    //     <p><strong>Total Amount:</strong> ₹${paidOrder.totalAmount}</p>
    //     <p><strong>Your Products:</strong></p>
    //     <ul>${productList}</ul>
    //     <p>We will notify you once your order is out for delivery.</p>
    //     <p>Thanks for ordering with <strong>Subsify !!</strong></p>
    //   `,
    // };
// const htmlTemplate = await renderTemplate("orderPlaced.ejs", {
//   name: user.name || "User",
//   orderId: paidOrder._id,
//   totalAmount: paidOrder.totalAmount,

//   items: orderedItems.map((item) => ({
//     name: item.product.name,
//     quantity: item.quantity,
//     price: item.price,
//   })),

//   orderLink: `${process.env.FRONTEND_URL}/orders/${paidOrder._id}`,
// });

// const mailOptions = {
//   from: `"Subsify" <${process.env.MAIL_USER}>`,
//   to: user.email,
//   subject: "Order Placed Successfully 📦",
//   html: htmlTemplate,
// };

//     let emailSent = false;
//     try {
//       await transporter.sendMail(mailOptions);
//       emailSent = true;
//     } catch (mailError) {
//       console.error("Failure in sending mail:", mailError.message);
//     }
    const finalItems = await OrderItem.find({ order: paidOrder._id })
      .populate("product", "name price")
      .lean();

    const finalOrder = {
      orderId: paidOrder._id,
      address: paidOrder.address,
      // subscriptionType: paidOrder.subscriptionType,
      totalAmount: paidOrder.totalAmount,
      products: finalItems,
    };

    return handleResponse(res, 200, "Order Placed Successfully", finalOrder);
  } catch (err) {
    console.error("Verify Payment Error", err.message);
    return handleResponse(res, 500, "Internal Server Error", {
      error: err.message,
    });
  }
};
