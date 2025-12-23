import handleResponse from "../utils/helper.js";
import Cart from "../models/cart.js";
import User from "../models/user.js";
import Order from "../models/order.js";
import OrderItem from "../models/orderItem.js";
import { transporter } from "../utils/emailHandler.js";
import { createOrderValidator } from "../validations/order.js";
import DeliveryPartner from "../models/deliveryPartner.js";
import ejs from "ejs";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { fileURLToPath } from "url";
import deliveryPartner from "../models/deliveryPartner.js";


export const placeOrder = async (req, res) => {
  try {
    const { error, value } = createOrderValidator.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return handleResponse(res, 400, "Validation error", {
        details: error.details.map((err) => err.message),
      });
    }
    const { address, subscriptionType, paymentMode } = value;

    const userId = req.id;
    // console.log("userId===", userId);

    const cartItems = await Cart.find({ userId }).populate("product");
    // console.log("cartItems====", cartItems);
    if (cartItems.length === 0) {
      return handleResponse(res, 400, "cart is empty");
    }

    let totalAmount = 0;
    for (let item of cartItems) {
      // console.log("item.product===", item.product);

      if (!item.product) {
        return handleResponse(res, 400, "product not found");
      }
      totalAmount += item.product.price * item.quantity;
    }

    const order = await Order.create({
      user: userId,
      totalAmount,
      address,
      subscriptionType,
      paymentMode: "cod",
      orderStatus: "placed",
    });
    for (let item of cartItems) {
      await OrderItem.create({
        order: order._id,
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      });
    }
    const orderedItems = await OrderItem.find({ order: order._id }).populate(
      "product",
      "name price image"
    );

    await Cart.deleteMany({ userId });
    const user = await User.findById(userId).select("email name");
    const productList = orderedItems
      .map(
        (item) => `
      <li>
        ${item.product.name} × ${item.quantity} — ₹${item.price}
      </li>
    `
      )
      .join("");

    const mailOptions = {
      from: `"no-reply"<${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Order Placed Succesfully",
      html: `
          <h3>Hello ${user.name || "user"} </h3>
          <span> Your Order has been successfully placed 
          <p> Thanks for ordering with<Strong> Subsify !! </strong></p>
          <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Total Amount:</strong> ₹${totalAmount}</p>

    <p><strong>Your Products:</strong></p>
    <ul>
      ${productList}
    </ul>

    <p>We will notify you once your order is out for delivery </p>

         
    
          `,
    };
    let emailSent = false;
    try {
      await transporter.sendMail(mailOptions);
      emailSent = true;
    } catch (mailError) {
      console.error("Failure in sending mail", mailError.message);
    }

    return handleResponse(res, 201, "Order Placed Successfully", {
      OrderId: order._id,
      totalAmount,
      products: orderedItems,
      message: emailSent
        ? "A confirmation email has been sent to your Gmail"
        : "Order Placed, but email could not be sent",
    });
  } catch (error) {
    console.error("Error in Adding the item to the cart", error.message);
    return handleResponse(res, 500, "internal Server Error", {
      error: error.message,
    });
  }
};

export const getAllOrder = async (req, res) => {
  try {
    const user = await User.findById(req.id);

    if (user.role !== "admin") {
      return handleResponse(res, 403, "only admin can proceed");
    }

    // const orders = await Order.find().populate("user", "name email");
    const orders = await Order.find({ deliveryAssigned: false })
      .populate("user", "name email")
      .populate("deliveryPartner", "name phone");

    let finalOrders = [];

    for (let order of orders) {
      const items = await OrderItem.find({ order: order._id }).populate(
        "product",
        "name price"
      );

      finalOrders.push({
        ...order.toObject(),
        items: items,
      });
       
    }
    return handleResponse(res, 200, "orders fetched successfully", {
      totalOrders: finalOrders.length,
      orders: finalOrders,
    });
  } catch (error) {
    console.log("get order error", error.message);
    return handleResponse(res, 500, "internal server error", {
      error: error.message,
    });
  }
};




export const getMyOrders = async (req, res) => {
  try {
    const userId = req.id;

    const orders = await Order.find({ user: userId }).populate({
      path: "subscription",
      select:
        "SubscriptionType duration shiftTime discountpercent startDate endDate",
    });

    if (!orders.length) {
      return handleResponse(res, 200, "No orders found", []);
    }

    let finalOrders = [];

    for (let order of orders) {
      const items = await OrderItem.find({ order: order._id }).populate(
        "product",
        "name price"
      );

      finalOrders.push({
        ...order.toObject(),
        items,
      });
    }

    return handleResponse(res, 200, "Orders fetched successfully", {
      totalOrders: finalOrders.length,
      orders: finalOrders,
    });
  } catch (error) {
    console.log("get my orders error:", error.message);
    return handleResponse(res, 500, "Internal server error", {
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
export const assignDeliveryPartner = async (req, res) => {
  try {
    const { partnerId } = req.body;
    const orderId = req.params.id;
    const admin = await User.findById(req.id);
    if (admin.role !== "admin") {
      return handleResponse(res, 403, "Only admin can assign partner");
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return handleResponse(res, 400, "Order not found");
    }
    const partner = await DeliveryPartner.findById(partnerId).select(
      "name phone"
    );
    if (!partner) {
      return handleResponse(res, 400, "Delivery partner not found");
    }
    // const { name, phone } = partner;
    order.deliveryPartner = partnerId;
    order.deliveryAssigned = true;
    order.status = "assigned";
    await order.save();
    const user = await User.findById(order.user).select("name email");
    let emailSent = false;
    if (user?.email) {
      // const mailOptions = {
      //   from: `"No-Reply" <${process.env.EMAIL_USER}>`,
      //   to: user.email,
      //   subject: "Delivery Partner Assigned",
      //   html: `
      //     <h3>Hello ${user.name || "User"}</h3>
      //     <p>Your delivery partner has been assigned successfully.</p>
      //     <p><strong>Order ID:</strong> ${order._id}</p>
      //     <p><strong>Delivery Partner:</strong> ${name}</p>
      //     <p><strong>Phone:</strong> ${phone}</p>
      //     <p>We will notify you once your order is out for delivery.</p>
      //     <p>Thanks for ordering with <strong>Subsify</strong></p>
      //   `,
      // };
      try {
       const htmlTemplate=await renderTemplate("deliveryPartner.ejs",{
      name: user.name || "User",
          orderId: order._id,
          totalAmount: order.totalAmount,
          partnerName: partner.name,
          partnerPhone: partner.phone,
      
      
    })
        await transporter.sendMail({

           from: `"Subsify" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "Delivery Partner Assigned 🚚",
          html: htmlTemplate,
        }
        );
        emailSent = true;
      } catch (mailError) {
        console.error("Failed to send email:", mailError.message);
      }
    }
   
    return handleResponse(res, 200, "Partner assigned successfully", {
      order,
      message: emailSent
        ? "A confirmation email has been sent to your Gmail"
        : "Partner assigned, but email could not be sent",
    });
  } catch (error) {
    console.error("Error assigning partner:", error.message);
    return handleResponse(res, 500, "Internal server error", {
      error: error.message,
    });
  }
};

export const getAssigned = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryAssigned: true })
      .populate("deliveryPartner", "name phone status")
      .sort({ createdAt: -1 });
    return handleResponse(res, 200, "Orders Fetched Successfully", orders);
  } catch (error) {
    console.error("Error in fetching the details", error.message);
    return handleResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};
